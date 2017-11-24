const { expect } = require('chai');
const is = require('./is');

describe('is', () => {
  describe('exactly', () => {
    it('returns a hobbes matcher with the given value', () => {
      expect(is('value')).to.have.property('value', 'value');
    });
  });

  describe('string', () => {
    it('returns a hobbes matcher with the given value', () => {
      expect(is.string('hello')).to.have.property('value', 'hello');
    });
  });

  describe('number', () => {
    it('returns a hobbes matcher with the given value', () => {
      expect(is.number(5)).to.have.property('value', 5);
    });
  });

  describe('boolean', () => {
    it('returns a hobbes matcher with the given value', () => {
      expect(is.boolean(true)).to.have.property('value', true);
    });
  });

  describe('object', () => {
    it('returns a hobbes matcher with a value that does not contain matchers', () => {
      expect(is.object({
        a: is('apple'),
        b: is.string('banana')
      })).to.have.deep.property('value', {
        a: 'apple',
        b: 'banana'
      });
    });
  });

  describe('arrayOf', () => {
    it('returns a hobbes matcher with the given value in an array when the inner value is an exact value', () => {
      expect(is.arrayOf(is('exact'))).to.have.deep.property('value', [ 'exact' ]);
    });

    it('returns a hobbes matcher with the given value in an array when the inner value is a matcher', () => {
      expect(is.arrayOf(is.string('string'))).to.have.deep.property('value', [ 'string' ]);
    });

    it('returns a hobbes matcher with the given value in an array when the inner value is an object', () => {
      expect(is.arrayOf(is.object({
        a: is('apple'),
        b: is.string('banana')
      }))).to.have.deep.property('value', [ {
        a: 'apple',
        b: 'banana'
      } ]);
    });

    it('returns a hobbes matcher with the given value in an array when the inner value is an array', () => {
      expect(is.arrayOf(is.arrayOf(is(1)))).to.have.deep.property('value', [ [ 1 ] ]);
    });
  });
});