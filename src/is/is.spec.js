const { expect } = require('chai');
const is = require('./is');

describe('is', () => {
  describe('string', () => {
    it('returns a hobbes matcher with the given value', () => {
      expect(is.string('hello').__hobbes__).to.have.property('value', 'hello');
    });
  });

  describe('number', () => {
    it('returns a hobbes matcher with the given value', () => {
      expect(is.number(5).__hobbes__).to.have.property('value', 5);
    });
  });
});