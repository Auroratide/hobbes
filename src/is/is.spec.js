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

  describe('boolean', () => {
    it('returns a hobbes matcher with the given value', () => {
      expect(is.boolean(true).__hobbes__).to.have.property('value', true);
    });
  });

  describe('arrayOf', () => {
    it('returns a hobbes matcher with the given value in an array when the inner value is an exact value', () => {
      expect(is.arrayOf('exact').__hobbes__).to.have.deep.property('value', [ 'exact' ]);
    });

    it('returns a hobbes matcher with the given value in an array when the inner value is a matcher', () => {
      expect(is.arrayOf(is.string('string')).__hobbes__).to.have.deep.property('value', [ 'string' ]);
    });

    it('returns a hobbes matcher with the given value in an array when the inner value is an object', () => {
      expect(is.arrayOf({
        a: 'apple',
        b: is.string('banana')
      }).__hobbes__).to.have.deep.property('value', [ {
        a: 'apple',
        b: 'banana'
      } ]);
    });

    it('returns a hobbes matcher with the given value in an array when the inner value is an array', () => {
      expect(is.arrayOf(is.arrayOf(1)).__hobbes__).to.have.deep.property('value', [ [ 1 ] ]);
    });
  });
});