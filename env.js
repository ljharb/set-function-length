'use strict';

var gOPD = require('gopd');
var bind = require('function-bind');

var unbound = gOPD && gOPD(function () {}, 'length');
var bound = gOPD && gOPD(bind.call(function () {}), 'length');

var functionsHaveConfigurableLengths = !!(unbound && unbound.configurable);

var functionsHaveWritableLengths = !!(unbound && unbound.writable);

var boundFnsHaveConfigurableLengths = !!(bound && bound.configurable);

var boundFnsHaveWritableLengths = !!(bound && bound.writable);

module.exports = {
	__proto__: null,
	boundFnsHaveConfigurableLengths: boundFnsHaveConfigurableLengths,
	boundFnsHaveWritableLengths: boundFnsHaveWritableLengths,
	functionsHaveConfigurableLengths: functionsHaveConfigurableLengths,
	functionsHaveWritableLengths: functionsHaveWritableLengths
};
