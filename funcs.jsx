import escapeForRegExp from 'escape-string-regexp';


/**
 * A list of built-in functions that only compute a value without changing the
 * program state in any "observable" manner.
 */
export const pureFuncs = [
    // https://tc39.github.io/ecma262/#sec-object.is
    'Object.is', 'Object.isExtensible', 'Object.isFrozen', 'Object.isSealed',

    // These simply return false for anything that isn't a number.
    // https://tc39.github.io/ecma262/#sec-number.isfinite
    'Number.isFinite', 'Number.isInteger', 'Number.isNaN',
    'Number.isSafeInteger',

    // https://tc39.github.io/ecma262/#sec-date.now
    'Date.now',

    // https://tc39.github.io/ecma262/#sec-arraybuffer.isview
    'ArrayBuffer.isView',

    // https://tc39.github.io/ecmascript_sharedmem/shmem.html
    'SharedArrayBuffer.isView'
];

/**
 * A regular expression matching any of the pureFuncs and nothing more.
 */
export const pureFuncsRegex = RegExp(
                            `^(${pureFuncs.map(escapeForRegExp).join('|')})$`);


/**
 * Pure functions that may throw an exception, but only in some non-typical
 * usage scenarios.
 *
 * The "unusual exception" and "non-typical scenario" are obviously subjective
 * and completely imprecise notions. However, there are relatively few truly
 * pure functions in ES and quite a few that can usually be considered for
 * removal in optimization of a web application. You've been warned :-)
 */
export const pureFuncsWithUnusualException = pureFuncs.concat([
    // TypeError in ToNumber() and ToString().
    'isFinite', 'isNaN', 'parseFloat', 'parseInt',

    // TypeError in various places (e.g. in ToObject()).
    'Object.create', 'Object.getOwnPropertyDescriptor',
    'Object.getOwnPropertyNames', 'Object.getOwnPropertySymbols',
    'Object.getPrototypeOf', 'Object.keys',

    // See http://tc39.github.io/proposal-object-values-entries/.
    'Object.entries', 'Object.values',

    // TypeError if called with a non-symbol argument.
    'Symbol.keyFor',

    // Same as the global functions.
    'Number.parseFloat', 'Number.parseInt',

    // TypeError in ToNumber() (e.g. Math.abs(Symbol.for(0))).
    'Math.abs', 'Math.acos', 'Math.acosh', 'Math.asin', 'Math.asinh',
    'Math.atan', 'Math.atanh', 'Math.atan2', 'Math.cbrt', 'Math.ceil',
    'Math.clz32', 'Math.cos', 'Math.cosh', 'Math.exp', 'Math.expm1',
    'Math.floor', 'Math.fround', 'Math.hypot', 'Math.imul', 'Math.log',
    'Math.log1p', 'Math.log10', 'Math.log2', 'Math.max', 'Math.min',
    'Math.pow', 'Math.random', 'Math.round', 'Math.sign', 'Math.sin',
    'Math.sinh', 'Math.sqrt', 'Math.tan', 'Math.tanh', 'Math.toSource',
    'Math.trunc',

    // At least TypeErrors in ToNumber() and ToString().
    'Date.parse', 'Date.UTC',

    // Various TypeErrors.
    'String.fromCharCode', 'String.raw',

    // Some more TypeErrors :-)
    'Array.from', 'Array.isArray', 'Array.of',
    'Int8Array.from', 'Int8Array.of',
    'Uint8Array.from', 'Uint8Array.of',
    'Uint8ClampedArray.from', 'Uint8ClampedArray.of',
    'Int16Array.from', 'Int16Array.of',
    'Uint16Array.from', 'Uint16Array.of',
    'Int32Array.from', 'Int32Array.of',
    'Uint32Array.from', 'Uint32Array.of',
    'Float32Array.from', 'Float32Array.of',
    'Float64Array.from', 'Float64Array.of',

    // TypeErrors, including the one for cyclic structures, as well as
    // exceptions from a replacer function or a toJSON() method.
    'JSON.stringify',

    // TypeErrors due to IsCallable() or IsConstructor() returning false.
    'Promise.reject', 'Promise.resolve',

    // TypeError if the first argument is not an object.
    'Reflect.getOwnPropertyDescriptor', 'Reflect.getPrototypeOf',
    'Reflect.has', 'Reflect.isExtensible', 'Reflect.ownKeys',

    // Various TypeErrors.
    'Proxy.revocable',

    // http://tc39.github.io/ecma402/#sec-Intl.Collator.supportedLocalesOf
    'Intl.Collator.supportedLocalesOf',
    'Intl.DateTimeFormat.supportedLocalesOf',
    'Intl.NumberFormat.supportedLocalesOf'
]);

/**
 * A regular expression matching exactly the "unusual exception" functions.
 */
export const pureFuncsWithUnusualExceptionRegex = RegExp(
        `^(${pureFuncsWithUnusualException.map(escapeForRegExp).join('|')})$`);


/**
 * Side-effects free functions, except for possibly throwing an exception.
 */
export const pureFuncsWithTypicalException = pureFuncsWithUnusualException
.concat([
    // URIError in Decode() and Encode().
    'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent',

    // RangeError for negative / too large code points.
    'String.fromCodePoint',

    // SyntaxError on invalid JSON.
    'JSON.parse'
]);

/**
 * A regular expression matching exactly the "typical exception" functions.
 */
export const pureFuncsWithTypicalExceptionRegex = RegExp(
        `^(${pureFuncsWithTypicalException.map(escapeForRegExp).join('|')})$`);
