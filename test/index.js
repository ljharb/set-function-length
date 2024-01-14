'use strict';

var test = require('tape');
var forEach = require('for-each');
var inspect = require('object-inspect');
var v = require('es-value-fixtures');
var gOPD = require('gopd');
var functionsHaveConfigurableLengths = true;
var functionsHaveWritableLengths = true;
if (gOPD) {
	var desc = gOPD(function f() {}, 'length');
	if (desc && !desc.configurable) {
		functionsHaveConfigurableLengths = false;
	}
	if (!desc || !desc.writable) {
		functionsHaveWritableLengths = false;
	}
}

var setFunctionLength = require('../');

test('set function length', function (t) {
	forEach(v.nonFunctions, function (nonFunction) {
		t['throws'](
			// @ts-expect-error
			function () { setFunctionLength(nonFunction); },
			TypeError,
			inspect(nonFunction) + ' is not a function'
		);
	});

	forEach(/** @type {unknown[]} */ ([]).concat(
		v.nonNumbers,
		v.nonIntegerNumbers,
		0xFFFFFFFF + 1
	), function (nonInteger) {
		t['throws'](
			// @ts-expect-error
			function () { setFunctionLength(nonInteger); },
			TypeError,
			inspect(nonInteger) + ' is not an integer in the proper range'
		);
	});

	t.test('setting the length', { skip: !functionsHaveConfigurableLengths && !functionsHaveWritableLengths }, function (st) {
		forEach(/** @type {Parameters<setFunctionLength>[0][]} */ ([]).concat(
			function zero() {},
			function one(_) {}, // eslint-disable-line no-unused-vars
			function two(_, __) {} // eslint-disable-line no-unused-vars
		), function (fn) {
			var origLength = fn.length;
			var newLength = (origLength * 2) + 12;

			var msg = inspect(fn) + ': returns it (' + Function.prototype.toString.call(fn) + ')';
			st.equal(setFunctionLength(fn, newLength), fn, msg);

			st.equal(
				fn.length,
				newLength,
				inspect(fn) + ': sets the name from ' + inspect(origLength) + ' to ' + inspect(newLength)
			);
		});

		st.end();
	});

	t.test('setting the length loosely', function (st) {
		forEach(/** @type {Parameters<setFunctionLength>[0][]} */ ([]).concat(
			function zero() {},
			function one(_) {}, // eslint-disable-line no-unused-vars
			function two(_, __) {} // eslint-disable-line no-unused-vars
		), function (fn) {
			var origLength = fn.length;

			var msg = inspect(fn) + ': returns it (' + Function.prototype.toString.call(fn) + ')';
			st.equal(setFunctionLength(fn, 42, true), fn, msg);

			var msg2 = (functionsHaveConfigurableLengths || functionsHaveWritableLengths)
				? inspect(fn) + ': loosely changes ' + inspect(origLength) + ' to ' + inspect(42)
				: inspect(fn) + ': loosely noops and keeps ' + inspect(origLength);
			st.equal(
				fn.length,
				(functionsHaveConfigurableLengths || functionsHaveWritableLengths) ? 42 : origLength,
				msg2
			);
		});

		st.end();
	});

	t.test('functions with a deleted length', { skip: !functionsHaveConfigurableLengths }, function (st) {
		// @ts-expect-error
		var f = function g(_) {}; // eslint-disable-line no-unused-vars
		st.equal(f.length, 1, 'initial function length is 1');

		// @ts-expect-error
		delete f.length;

		st.equal(f.length, 0, 'function with deleted length is 0');

		setFunctionLength(f, 42);

		st.equal(f.length, 42, 'set function length is 42');

		st.end();
	});

	t.end();
});
