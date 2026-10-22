const {test} = require('node:test');
const assert = require('node:assert/strict');
const {rpm, feed} = require('../assets/js/machining-calculator.v1.js');
test('metric milling calculations preserve units and effective tooth count', () => {
  assert.ok(Math.abs(rpm(400, 10) - 12732.395447351628) < 1e-8);
  assert.equal(feed(12000, 1, .04), 480);
  assert.equal(feed(12000, 2, .04), 960);
});
test('invalid inputs and overflow cannot produce a usable machining result', () => {
  for (const value of [0, -1, '', 'bad', NaN, Infinity]) {
    assert.throws(() => rpm(100, value), RangeError);
    assert.throws(() => feed(value, 2, .04), RangeError);
  }
  assert.throws(() => feed(1000, 1.5, .04), RangeError);
  assert.throws(() => feed(1e308, 4, 1e308), RangeError);
});
