!function(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(require("escape-string-regexp")):"function"==typeof define&&define.amd?define(["escape-string-regexp"],r):"object"==typeof exports?exports.SideEffectsSafe=r(require("escape-string-regexp")):e.SideEffectsSafe=r(e["escape-string-regexp"])}(this,function(){return function(e){function r(n){if(t[n])return t[n].e;var a=t[n]={e:{},i:n,l:!1};return e[n].call(a.e,a,a.e,r),a.l=!0,a.e}var t={};return r.m=e,r.c=t,r.p="dist",r(r.s=2)}([function(e,r,t){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0}),r.pureFuncsWithTypicalExceptionRegex=r.pureFuncsWithTypicalException=r.pureFuncsWithUnusualExceptionRegex=r.pureFuncsWithUnusualException=r.pureFuncsRegex=r.pureFuncs=void 0;var a=t(3),s=n(a),u=r.pureFuncs=["Object.is","Object.isExtensible","Object.isFrozen","Object.isSealed","Number.isFinite","Number.isInteger","Number.isNaN","Number.isSafeInteger","Date.now","ArrayBuffer.isView","SharedArrayBuffer.isView"],i=(r.pureFuncsRegex=RegExp("^("+u.map(s["default"]).join("|")+")$"),r.pureFuncsWithUnusualException=u.concat(["isFinite","isNaN","parseFloat","parseInt","Object.create","Object.getOwnPropertyDescriptor","Object.getOwnPropertyNames","Object.getOwnPropertySymbols","Object.getPrototypeOf","Object.keys","Object.entries","Object.values","Symbol.keyFor","Number.parseFloat","Number.parseInt","Math.abs","Math.acos","Math.acosh","Math.asin","Math.asinh","Math.atan","Math.atanh","Math.atan2","Math.cbrt","Math.ceil","Math.clz32","Math.cos","Math.cosh","Math.exp","Math.expm1","Math.floor","Math.fround","Math.hypot","Math.imul","Math.log","Math.log1p","Math.log10","Math.log2","Math.max","Math.min","Math.pow","Math.random","Math.round","Math.sign","Math.sin","Math.sinh","Math.sqrt","Math.tan","Math.tanh","Math.toSource","Math.trunc","Date.parse","Date.UTC","String.fromCharCode","String.raw","Array.from","Array.isArray","Array.of","Int8Array.from","Int8Array.of","Uint8Array.from","Uint8Array.of","Uint8ClampedArray.from","Uint8ClampedArray.of","Int16Array.from","Int16Array.of","Uint16Array.from","Uint16Array.of","Int32Array.from","Int32Array.of","Uint32Array.from","Uint32Array.of","Float32Array.from","Float32Array.of","Float64Array.from","Float64Array.of","JSON.stringify","Promise.reject","Promise.resolve","Reflect.getOwnPropertyDescriptor","Reflect.getPrototypeOf","Reflect.has","Reflect.isExtensible","Reflect.ownKeys","Proxy.revocable","Intl.Collator.supportedLocalesOf","Intl.DateTimeFormat.supportedLocalesOf","Intl.NumberFormat.supportedLocalesOf"])),o=(r.pureFuncsWithUnusualExceptionRegex=RegExp("^("+i.map(s["default"]).join("|")+")$"),r.pureFuncsWithTypicalException=i.concat(["decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","String.fromCodePoint","JSON.parse"]));r.pureFuncsWithTypicalExceptionRegex=RegExp("^("+o.map(s["default"]).join("|")+")$")},function(e,r,t){"use strict";function n(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:u,t=r.pureMembers,s=r.pureCallees;switch(e.type){case"Identifier":case"RegExpLiteral":case"NullLiteral":case"StringLiteral":case"BooleanLiteral":case"NumericLiteral":case"DirectiveLiteral":case"Super":case"ThisExpression":return!0;case"UnaryExpression":return"delete"!==e.operator&&n(e.argument,r);case"BinaryExpression":case"LogicalExpression":return n(e.left,r)&&n(e.right,r);case"ConditionalExpression":return n(e.test,r)&&n(e.alternate,r)&&n(e.consequent,r);case"SequenceExpression":return e.expressions.every(function(e){return n(e,r)});case"ArrayExpression":return e.elements.every(function(e){return null===e||n(e,r)});case"SpreadElement":return n(e.argument);case"ObjectExpression":return e.properties.every(function(e){return n(e,r)});case"ObjectProperty":return n(e.key,r)&&n(e.value,r)&&!e.decorators;case"ObjectMethod":return n(e.key,r)&&e.params.every(function(e){return n(e,r)})&&!e.decorators;case"RestProperty":case"SpreadProperty":return n(e.argument,r);case"MemberExpression":return!!t&&t.test(a(e));case"ArrowFunctionExpression":case"FunctionExpression":return e.params.every(function(e){return n(e,r)});case"AssignmentPattern":return n(e.left)&&n(e.right);case"CallExpression":case"NewExpression":return!!s&&s.test(a(e.callee))&&e.arguments.every(function(e){return n(e,r)});case"AwaitExpression":return n(e.expression,r);case"BindExpression":return(null===e.object||n(e.object,r))&&n(e.callee,r);default:return!1}}function a(e){switch(e.type){case"Identifier":return e.name;case"Super":return"super";case"ThisExpression":return"this";case"MemberExpression":var r=e.computed,t=e.object,n=e.property,s=a(t);if(null===s)return null;var u=void 0;if(r)switch(n.type){case"StringLiteral":u=n.value;break;case"BooleanLiteral":case"NumericLiteral":u=n.value+"";break;case"NullLiteral":u="null";break;case"Super":u="super";break;case"ThisExpression":u="this";break;default:return null}else u=n.name;return s+"."+u;default:return null}}Object.defineProperty(r,"__esModule",{value:!0}),r["default"]=n;var s=t(0),u={pureMembers:null,pureCallees:s.pureFuncsWithUnusualExceptionRegex}},function(e,r,t){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var a=t(0);Object.defineProperty(r,"pureFuncs",{enumerable:!0,get:function(){return a.pureFuncs}}),Object.defineProperty(r,"pureFuncsRegex",{enumerable:!0,get:function(){return a.pureFuncsRegex}}),Object.defineProperty(r,"pureFuncsWithUnusualException",{enumerable:!0,get:function(){return a.pureFuncsWithUnusualException}}),Object.defineProperty(r,"pureFuncsWithUnusualExceptionRegex",{enumerable:!0,get:function(){return a.pureFuncsWithUnusualExceptionRegex}}),Object.defineProperty(r,"pureFuncsWithTypicalException",{enumerable:!0,get:function(){return a.pureFuncsWithTypicalException}}),Object.defineProperty(r,"pureFunctWithTypicalExceptionRegex",{enumerable:!0,get:function(){return a.pureFunctWithTypicalExceptionRegex}});var s=t(1);Object.defineProperty(r,"pureBabylon",{enumerable:!0,get:function(){return n(s)["default"]}})},function(e){e.e=require("escape-string-regexp")}])});