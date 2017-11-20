const { expect } = require('chai');
const is = require('./is');

describe('is', () => {
  describe('string', () => {
    it('returns a hobbes matcher with the given value', () => {
      expect(is.string('hello').__hobbes__).to.have.property('value', 'hello');
    });
  });
});