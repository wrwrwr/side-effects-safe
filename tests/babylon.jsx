import * as t from 'babel-types';
import {parse} from 'babylon';

import pure from '../pure/babylon';

// Parses a sole expression and returns its subtree.
const ex = code => parse(`(${code})`).program.body[0].expression;


suite("babylon/pure()", () => {
    test("identifiers and literals", () => {
        pure(ex('a')).should.be.true();
        pure(ex('"b"')).should.be.true();
        pure(ex('3')).should.be.true();
        pure(ex('true')).should.be.true();
        pure(ex('null')).should.be.true();
        pure(ex('undefined')).should.be.true();
    });

    test("unary expressions", () => {
        pure(ex('+a')).should.be.true();
        pure(ex('-a')).should.be.true();
        pure(ex('~a')).should.be.true();
        pure(ex('!true')).should.be.true();
        pure(ex('typeof a')).should.be.true();
        pure(ex('void 0')).should.be.true();
        pure(ex('delete a')).should.be.false();
        pure(ex('a++')).should.be.false();
        pure(ex('--a[b]')).should.be.false();
    });

    test("binary expressions", () => {
        pure(ex('a + 3')).should.be.true();
        pure(ex('a % b')).should.be.true();
        pure(ex('(a + b - c) * d')).should.be.true();
        pure(ex('false || true >>> 3')).should.be.true();
        pure(ex('a += 5')).should.be.false();
        pure(ex('a + (b %= 3)')).should.be.false();
        pure(ex('a[b] >>>= 4')).should.be.false();
    });

    test("arrays and objects", () => {
        pure(ex('[]')).should.be.true();
        pure(ex('[1, "2", false]')).should.be.true();
        pure(ex('[1, [a, [2, 3]], b, ...c]')).should.be.true();
        pure(ex('[a, [a, [c += 1, 3]], b]')).should.be.false();
        pure(ex('{}')).should.be.true();
        pure(ex('{a: 1, b: "2", c: false}')).should.be.true();
        pure(ex('{a, b, c: {d, e: f}, g() {}}')).should.be.true();
        pure(ex('{g(a = b++) {}}')).should.be.false();
        pure(ex('{a: 1, b: c++}')).should.be.false();
        pure(ex('{[a]: 1}')).should.be.true();
        pure(ex('{[a++]: 1}')).should.be.false();
    });

    test("function expressions", () => {
        pure(ex('function(a) {return ++a;}')).should.be.true();
        pure(ex('function(a = b) {return a;}')).should.be.true();
        pure(ex('function(a = b++) {return a;}')).should.be.false();
        pure(ex('(a, b) => a + (b %= 2)')).should.be.true();
        pure(ex('(a, b = c) => a + (b %= 2)')).should.be.true();
        pure(ex('(a, b = (c %= 2)) => a + b')).should.be.false();
    });

    test("pure members", () => {
        pure(ex('a.b')).should.be.false();
        pure(ex('a[b]')).should.be.false();
        pure(ex('a.b'), {pureMembers: /a$/}).should.be.false();
        pure(ex('a.b'), {pureMembers: /b$/}).should.be.true();
        pure(ex('a["b"]'), {pureMembers: /b$/}).should.be.true();
        pure(ex('a[3]'), {pureMembers: /3$/}).should.be.true();
        pure(ex('a.b.c'), {pureMembers: /b$/}).should.be.false();
        pure(ex('a.b.c'), {pureMembers: /^a/}).should.be.true();
        pure(ex('a.b.c'), {pureMembers: /c$/}).should.be.true();
        pure(ex('a[b].c'), {pureMembers: /^a/}).should.be.false();
        pure(ex('a[b].c'), {pureMembers: /c$/}).should.be.false();
        pure(ex('a[3]["c"]'), {pureMembers: /^a\.\d+\.c$/}).should.be.true();
        pure(ex('a[3][c]'), {pureMembers: /^a\.\d+\.c$/}).should.be.false();
    });

    test("pure callees", () => {
        pure(ex('f()')).should.be.false();
        pure(ex('f(a)')).should.be.false();
        pure(ex('Object.is(0, 1)')).should.be.true();
        pure(ex('JSON.parse(a)')).should.be.false();
        pure(ex('f()'), {pureCallees: /^f$/}).should.be.true();
        pure(ex('f(a)'), {pureCallees: /^f$/}).should.be.true();
        pure(ex('f(a++)'), {pureCallees: /^f$/}).should.be.false();
        pure(ex('a.b()'), {pureMembers: /^b$/}).should.be.false();
        pure(ex('a.b()'), {pureCallees: /^b$/}).should.be.false();
        pure(ex('a.b()'), {pureCallees: /^a\.b$/}).should.be.true();
        pure(ex('a[b]()'), {pureCallees: /^a\.b$/}).should.be.false();
        pure(ex('a["b"]()'), {pureCallees: /^a\.b$/}).should.be.true();
    });
});


suite("babylon/examples", () => {
    test("basic", () => {
        pure(t.binaryExpression('*', t.identifier('a'), t.identifier('b')))
                                                            .should.be.true();
        pure(t.updateExpression('++', t.identifier('a'))).should.be.false();
    });

    test("with options", () => {
        let propExp = t.memberExpression(t.identifier('a'), t.identifier('b'));
        pure(propExp).should.be.false();
        pure(propExp, {pureMembers: /^a\.b$/}).should.be.true();

        let callExp = t.callExpression(t.identifier('f'), []);
        pure(callExp).should.be.false();
        pure(callExp, {pureCallees: /^f$/}).should.be.true();
    });
});
