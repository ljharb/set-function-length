'use strict';

var test = require('tape');
var gOPD = require('gopd');
var callBind = require('call-bind');

var env = require('../env');

test('functionsHaveConfigurableLengths', function (t) {
	var fn = function f() {};

	t.test('yes', { skip: !env.functionsHaveConfigurableLengths }, function (st) {
		// @ts-expect-error ts(2532) all functions have a length if they have configurable lengths
		st.equal(gOPD(fn, 'length').configurable, true, 'function length is configurable');

		st.end();
	});

	t.test('no', { skip: env.functionsHaveConfigurableLengths }, function (st) {
		st['throws'](
			function () {
				if (gOPD && !env.functionsHaveWritableLengths) {
					Object.defineProperty(fn, 'length', { value: 42 });
				} else {
					// @ts-expect-error ts(2704) in this code path, length is deletable
					delete fn.length;
				}
			},
			TypeError,
			'function length is not configurable'
		);
		st.end();
	});

	t.end();
});

test('functionsHaveWritableLengths', function (t) {
	var fn = function f() {};

	t.test('yes', { skip: !env.functionsHaveWritableLengths }, function (st) {
		// @ts-expect-error ts(2532) all functions have a length if they have writable lengths
		st.equal(gOPD(fn, 'length').writable, true, 'function length is writable');

		st.end();
	});

	t.test('no', { skip: env.functionsHaveWritableLengths }, function (st) {
		st['throws'](
			function () {
				// @ts-expect-error ts(2704) in this code path, length is deletable
				fn.length = 42;
			},
			TypeError,
			'function length is not writable'
		);
		st.end();
	});

	t.end();
});

test('boundFnsHaveConfigurableLengths', function (t) {
	var fn = callBind(function f() {});

	t.test('yes', { skip: !env.boundFnsHaveConfigurableLengths }, function (st) {
		// @ts-expect-error ts(2532) all functions have a length if they have configurable lengths
		st.equal(gOPD(fn, 'length').configurable, true, 'bound function length is configurable');

		st.end();
	});

	t.test('no', { skip: env.boundFnsHaveConfigurableLengths }, function (st) {
		st['throws'](
			function () {
				if (gOPD) {
					Object.defineProperty(fn, 'length', { value: 42 });
				} else {
					// @ts-expect-error ts(2704) in this code path, length is deletable
					delete fn.length;
				}
			},
			TypeError,
			'bound function length is not configurable'
		);
		st.end();
	});

	t.end();
});

test('boundFnsHaveWritableLengths', function (t) {
	var fn = callBind(function f() {});

	t.test('yes', { skip: !env.boundFnsHaveWritableLengths }, function (st) {
		// @ts-expect-error ts(2532) all functions have a length if they have writable lengths
		st.equal(gOPD(fn, 'length').writable, true, 'bound function length is writable');

		st.end();
	});

	t.test('no', { skip: env.boundFnsHaveWritableLengths }, function (st) {
		st['throws'](
			function () {
				// @ts-expect-error ts(2540) in this code path, length is writable
				fn.length = 42;
			},
			TypeError,
			'bound function length is not writable'
		);
		st.end();
	});

	t.end();
});
