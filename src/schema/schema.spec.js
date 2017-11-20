const { expect } = require('chai');
const Schema = require('./schema');

describe('schema', () => {
  describe('exact matches', () => {
    it('should return true when the string value matches exactly', () => {
      const schema = Schema.create('hello');
      expect(schema.matches('hello')).to.be.true;
    });

    it('should return false when the string value does not match exactly', () => {
      const schema = Schema.create('hello');
      expect(schema.matches('helloo')).to.be.false;
      expect(schema.matches('')).to.be.false;
    });

    it('should return true when the number value matches exactly', () => {
      const schema = Schema.create(5.6);
      expect(schema.matches(5.6)).to.be.true;
    });

    it('should return false when the number value does not match exactly', () => {
      const schema = Schema.create(5.6);
      expect(schema.matches(5.7)).to.be.false;
      expect(schema.matches(0)).to.be.false;
    });

    it('should return true when the boolean value matches exactly', () => {
      const schema = Schema.create(true);
      expect(schema.matches(true)).to.be.true;
    });

    it('should return false when the boolean value does not match exactly', () => {
      const schema = Schema.create(true);
      expect(schema.matches(false)).to.be.false;
    });
  });

  describe('strings', () => {
    it('should return true when the value is a string', () => {
      const schema = Schema.create({
        __hobbes__: {
          type: 'string'
        }
      });

      expect(schema.matches('hello')).to.be.true;
      expect(schema.matches('world')).to.be.true;
    });

    it('should return false when the value is not a string', () => {
      const schema = Schema.create({
        __hobbes__: {
          type: 'string'
        }
      });

      expect(schema.matches(5)).to.be.false;
      expect(schema.matches({})).to.be.false;
      expect(schema.matches(true)).to.be.false;
      expect(schema.matches([])).to.be.false;
    });
  });

  describe('objects', () => {
    it('should return true when all key-values match', () => {
      const schema = Schema.create({
        key1: 'value',
        key2: 56
      });

      expect(schema.matches({
        key1: 'value',
        key2: 56
      })).to.be.true;
    });

    it('should return false when any of the key-values does not match', () => {
      const schema = Schema.create({
        key1: 'value',
        key2: 56
      });

      expect(schema.matches({
        key1: 'wrong',
        key2: 56
      })).to.be.false;
    });
  });
});