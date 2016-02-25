side-effects-safe
=================

Provides lists of side-effects free functions and a helper to check if an
abstract syntax tree expression node can be dropped if its value is not used.

Statically deciding if a piece of code changes program state is not trivial
&ndash; [Rice's theorem][] suggests that the problem is in general undecidable.
However, side-effects safety (with false negatives) may suffice for
optimization purposes.

<!--
    Consider (possibly with f() limited to some subset of the language):

        f(a) === 0 ? i++ : null

    If the function returns 0 for some argument, the expression is not 
    side-effects free, otherwise it is. Now, returning 0 for some argument
    is a non-trivial property of computable functions.
-->

[Rice's theorem]: https://en.wikipedia.org/wiki/Rice's_theorem

Pure function lists
-------------------

Three lists of functions are provided:

* `pureFuncs`

    Calls to functions from this list should be safe to drop if the return
    value is not used (unless you do some nasty overriding).

* `pureFuncsWithUnusualException`

    These functions might throw a (commonly unhandled) exception in rare
    circumstances. However, it should be "almost correct" to consider them
    pure (for the purpose of optimizing a web application). For instance,
    `isFinite()` and `isNaN()` may throw a `TypeError` if given a `Symbol`.
    <sup>[1](#f1)</sup>

* `pureFuncsWithTypicalException`

    Functions that do not have side-effects, but do throw exceptions that are
    commonly handled. An example is `JSON.parse()` throwing `SyntaxError` for
    malformed JSON.

<sub>
<a id="f1">1.</a>
    See [ToNumber()](https://tc39.github.io/ecma262/#sec-tonumber). Technically,
    some expressions may also throw a `TypeError`, e.g. `+Symbol.for(0)`.
</sub>

#### Usage with [Uglify][]

Pass one of the provided lists as the `pure_funcs` compressor option:

```bash
export PURE_FUNCS=`nodejs -p "require('side-effects-safe').pureFuncs"`
uglifyjs -c pure_funcs="$PURE_FUNCS" bundle.js
```

[uglify]: http://lisperator.net/uglifyjs/

#### Usage through [Webpack][]

The same within a `webpack.config.js`:

```javascript
const pureFuncs = require('side-effects-safe').pureFuncs;
const webpack = require('webpack');

module.exports = {
    ...
    plugins: [
        new webpack.optimize.UglifyJsPlugin({compress: {pure_funcs: pureFuncs}})
    ]
};
```

[webpack]: https://webpack.github.io/

AST expression tester
---------------------

### Babylon 6

A single `pure(node, opts)` function meant to be used by [Babel][] transforms
is currently available. The function checks if an AST expression node could be
dropped if we knew that its value is not going to be used:

```javascript
import * as t from 'babel-types';
import {pureBabylon as pure} from 'side-effects-safe';

pure(t.binaryExpression('*', t.identifier('a'), t.identifier('b')));  // true
pure(t.updateExpression('++', t.identifier('a')));  // false
```

##### Options

You may pass a regular expression matching accessor chains that can be assumed
pure:

```javascript
let ex = t.memberExpression(t.identifier('a'), t.identifier('b'));  // a.b
pure(ex);  // false
pure(ex, {pureMembers: /^a\.b$/});  // true
```

Similarly for callee expressions:

```javascript
let ex = t.callExpression(t.identifier('f'), []);  // f()
pure(ex);  // false
pure(ex, {pureCallees: /^f$/});  // true
```

Regexes are matched against a string with dots, irrespective of the property
style used in code (for example `a[3].b['c']` is normalized to `a.3.b.c` and
`a[b]` never matches).

##### Example

Here's a sketch of a transform to remove no-op expression statements:

```javascript
import {pureBabylon as pure} from 'side-effects-safe';

export default () => ({
    visitor: {
        ExpressionStatement(path) {
            if (pure(path.node.expression)) {
                path.remove();
            }
        }
    }
});
```

This is implemented in [babel-remove-pure-exps][]. Take a look at
[babel-remove-props][] for another usage example.

[babel]: https://babeljs.io/
[babel-remove-pure-exps]: https://github.com/wrwrwr/babel-remove-pure-exps
[babel-remove-props]: https://github.com/wrwrwr/babel-remove-props

Installation
------------

```bash
npm install side-effects-safe
```

The pure function lists were produced by skimming a draft of the ES7 standard
from February 2016. If you note something inaccurate or outdated please open
an issue.
