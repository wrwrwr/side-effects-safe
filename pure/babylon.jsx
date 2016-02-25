import {pureFuncsWithUnusualExceptionRegex} from '../funcs';

// Default options for pure().
const optsDefaults = {
    // '\,length$' or '^\.\d+$' would be good candidates, but statically we
    // do not know what object the member is taken from and proxies let you
    // override almost anything.
    pureMembers: null,

    // We ignore TypeErrors in expression, so allowing similar exceptions in
    // functions seems adequate.
    pureCallees: pureFuncsWithUnusualExceptionRegex
};


/**
 * Checks if code represented by a Babel's (Babylon 6) AST expression node does
 * nothing except for calculating a value. In other words, could we remove the
 * node's subtree if we knew that its value is not used.
 *
 * This is a "one-way" tester, when it says something is pure, it (hopefully)
 * is pure, but when it says something isn't, it still actually may be pure.
 *
 * You can pass in regular expressions matching object members and callees
 * known to be pure. For example:
 *
 *     pure(node, {pureMembers: /\.length$/, pureCallees: /^Number\.isNaN$/})
 *
 * AST docs: https://github.com/babel/babel/blob/master/doc/ast/spec.md.
 */
export default function pure(node, opts = optsDefaults) {
    let {pureMembers, pureCallees} = opts;
    switch (node.type) {
        // Identifiers, literals and the like.
        case 'Identifier':
        case 'RegExpLiteral':
        case 'NullLiteral':
        case 'StringLiteral':
        case 'BooleanLiteral':
        case 'NumericLiteral':
        case 'DirectiveLiteral':
        case 'Super':
        case 'ThisExpression':
            return true;

        // Basic expressions.
        case 'UnaryExpression':
            return node.operator !== 'delete' && pure(node.argument, opts);
        case 'BinaryExpression':
        case 'LogicalExpression':
            return pure(node.left, opts) && pure(node.right, opts);
        case 'ConditionalExpression':
            return pure(node.test, opts) && pure(node.alternate, opts) &&
                                                pure(node.consequent, opts);
        case 'SequenceExpression':
            return node.expressions.every(e => pure(e, opts));

        // Arrays and objects.
        case 'ArrayExpression':
            return node.elements.every(e => e === null || pure(e, opts));
        case 'SpreadElement':
            return pure(node.argument);
        case 'ObjectExpression':
            return node.properties.every(p => pure(p, opts));
        case 'ObjectProperty':
            return pure(node.key, opts) && pure(node.value, opts) &&
                                                            !node.decorators;
        case 'ObjectMethod':
            return pure(node.key, opts) &&
                    // (!node.value || pure(node.value, opts) &&
                    node.params.every(p => pure(p, opts)) && !node.decorators;
        case 'RestProperty':
        case 'SpreadProperty':
            return pure(node.argument, opts);

        // Members (dot and bracket accessors).
        case 'MemberExpression':
            return Boolean(pureMembers) &&
                            pureMembers.test(membersString(node));

        // Function expressions and calls.
        case 'ArrowFunctionExpression':
        case 'FunctionExpression':
            return node.params.every(p => pure(p, opts));
        case 'AssignmentPattern':
            // Function or method argument with a default.
            return pure(node.left) && pure(node.right);
        case 'CallExpression':
        case 'NewExpression':
            return Boolean(pureCallees) &&
                            pureCallees.test(membersString(node.callee)) &&
                                    node.arguments.every(a => pure(a, opts));

        // Miscellaneous.
        case 'AwaitExpression':
            return pure(node.expression, opts);
        case 'BindExpression':
            return (node.object === null || pure(node.object, opts)) &&
                                                    pure(node.callee, opts);

        default:
            return false;
    }
}


/**
 * Returns a string representation of an accessors chain.
 *
 * Used for testing against pureMembers and pureCallees. For example,
 * a[3].b[true]['c'] is represented by 'a.3.b.true.c'.
 */
function membersString(node) {
    switch (node.type) {
        case 'Identifier':
            return node.name;
        case 'Super':
            return 'super';
        case 'ThisExpression':
            return 'this';
        case 'MemberExpression': {
            let {computed, object, property} = node;
            let prefix = membersString(object);
            if (prefix === null) {
                return null;
            }
            let suffix;
            if (computed) {
                switch (property.type) {
                    case 'StringLiteral':
                        suffix = property.value;
                        break;
                    case 'BooleanLiteral':
                    case 'NumericLiteral':
                        suffix = String(property.value);
                        break;
                    case 'NullLiteral':
                        suffix = 'null';
                        break;
                    case 'Super':
                        suffix = 'super';
                        break;
                    case 'ThisExpression':
                        suffix = 'this';
                        break;
                    default:
                        return null;
                }
            } else {
                suffix = property.name;
            }
            return `${prefix}.${suffix}`;
        }
        default:
            return null;
    }
}
