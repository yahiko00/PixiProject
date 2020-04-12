'use strict';

const assert = require('assert');
const add = (a, b) => a + b; // Just as an example. Better to "require"

describe('Tests', () => {
  it('should add correctly', () => {
    assert.equal(add(1, 1), 2);
  });
});
