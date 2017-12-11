const { expect } = require('chai');
const Schema = require('./schema');
const Types = require('../constants/types');

describe('schema', () => {
  describe('exact matches', () => {
    it('should return true when the string value matches exactly', () => {
      const schema = Schema.create({
        type: Types.EXACT,
        value: 'hello'
      });

      expect(schema.matches('hello')).to.be.true;
    });

    it('should return false when the string value does not match exactly', () => {
      const schema = Schema.create({
        type: Types.EXACT,
        value: 'hello'
      });

      expect(schema.matches('helloo')).to.be.false;
      expect(schema.matches('')).to.be.false;
    });

    it('should return true when the number value matches exactly', () => {
      const schema = Schema.create({
        type: Types.EXACT,
        value: 5.6
      });
      expect(schema.matches(5.6)).to.be.true;
    });

    it('should return false when the number value does not match exactly', () => {
      const schema = Schema.create({
        type: Types.EXACT,
        value: 5.6
      });

      expect(schema.matches(5.7)).to.be.false;
      expect(schema.matches(0)).to.be.false;
    });

    it('should return false when the number value is a string', () => {
      const schema = Schema.create({
        type: Types.EXACT,
        value: 5.6
      });

      expect(schema.matches('5.6')).to.be.false;
    });

    it('should return true when the boolean value matches exactly', () => {
      const schema = Schema.create({
        type: Types.EXACT,
        value: true
      });

      expect(schema.matches(true)).to.be.true;
    });

    it('should return false when the boolean value does not match exactly', () => {
      const schema = Schema.create({
        type: Types.EXACT,
        value: true
      });

      expect(schema.matches(false)).to.be.false;
    });
  });

  describe('strings', () => {
    it('should return true when the value is a string', () => {
      const schema = Schema.create({
        type: Types.STRING
      });

      expect(schema.matches('hello')).to.be.true;
      expect(schema.matches('world')).to.be.true;
    });

    it('should return false when the value is not a string', () => {
      const schema = Schema.create({
        type: Types.STRING
      });

      expect(schema.matches(5)).to.be.false;
      expect(schema.matches({})).to.be.false;
      expect(schema.matches(true)).to.be.false;
      expect(schema.matches([])).to.be.false;
    });
  });

  describe('number', () => {
    it('should return true when the value is a number', () => {
      const schema = Schema.create({
        type: Types.NUMBER
      });

      expect(schema.matches(5.6)).to.be.true;
      expect(schema.matches(-1.4)).to.be.true;
    });

    it('should return false when the value is not a number', () => {
      const schema = Schema.create({
        type: Types.NUMBER
      });

      expect(schema.matches('hello')).to.be.false;
      expect(schema.matches({})).to.be.false;
      expect(schema.matches(true)).to.be.false;
      expect(schema.matches([])).to.be.false;
    });
  });

  describe('boolean', () => {
    it('should return true when the value is a boolean', () => {
      const schema = Schema.create({
        type: Types.BOOLEAN
      });

      expect(schema.matches(true)).to.be.true;
      expect(schema.matches(false)).to.be.true;
    });

    it('should return false when the value is not a boolean', () => {
      const schema = Schema.create({
        type: Types.BOOLEAN
      });

      expect(schema.matches('hello')).to.be.false;
      expect(schema.matches({})).to.be.false;
      expect(schema.matches(5)).to.be.false;
      expect(schema.matches([])).to.be.false;
    });
  });

  describe('objects', () => {
    it('should return true when all key-values match', () => {
      const schema = Schema.create({
        type: Types.OBJECT,
        fields: {
          key1: {
            type: Types.EXACT,
            value: 'value'
          },
          key2: {
            type: Types.EXACT,
            value: 56
          }
        }
      });

      expect(schema.matches({
        key1: 'value',
        key2: 56
      })).to.be.true;
    });

    it('should return false when any of the key-values does not match', () => {
      const schema = Schema.create({
        type: Types.OBJECT,
        fields: {
          key1: {
            type: Types.EXACT,
            value: 'value'
          },
          key2: {
            type: Types.EXACT,
            value: 56
          }
        }
      });

      expect(schema.matches({
        key1: 'wrong',
        key2: 56
      })).to.be.false;
    });

    it('should return true when all key-values match in nested structures', () => {
      const schema = Schema.create({
        type: Types.OBJECT,
        fields: {
          key1: {
            type: Types.EXACT,
            value: 1
          },
          key2: {
            type: Types.OBJECT,
            fields: {
              key3: {
                type: Types.EXACT,
                value: 3
              },
              key4: {
                type: Types.EXACT,
                value: 4
              }
            }
          }
        }
      });

      expect(schema.matches({
        key1: 1,
        key2: {
          key3: 3,
          key4: 4
        }
      })).to.be.true;
    });

    it('should allow unknown keys', () => {
      const schema = Schema.create({
        type: Types.OBJECT,
        fields: {
          key1: {
            type: Types.EXACT,
            value: 'value'
          }
        }
      });

      expect(schema.matches({
        key1: 'value',
        key2: 56
      })).to.be.true;
    });

    it('should fail when expecting a key that is not present', () => {
      const schema = Schema.create({
        type: Types.OBJECT,
        fields: {
          key1: {
            type: Types.EXACT,
            value: 'value'
          }
        }
      });

      expect(schema.matches({
        key2: 56
      })).to.be.false;
    });
  });

  describe('arrays', () => {
    it('should return true when each value in the array conforms to the schema', () => {
      const schema = Schema.create({
        type: Types.ARRAY,
        of: {
          type: Types.STRING
        }
      });

      expect(schema.matches(['hello', 'world', '!'])).to.be.true;
    });

    it('should return false when any value in the array fails to conform to the schema', () => {
      const schema = Schema.create({
        type: Types.ARRAY,
        of: {
          type: Types.STRING
        }
      });

      expect(schema.matches(['hello', 5, '!'])).to.be.false;
    });

    it('should return false when the array is empty', () => {
      const schema = Schema.create({
        type: Types.ARRAY,
        of: {
          type: Types.STRING
        }
      });

      expect(schema.matches([])).to.be.false;
    });

    it('should return false when the array is an empty array of objects', () => {
      const schema = Schema.create({
        type: Types.ARRAY,
        of: {
          type: Types.OBJECT,
          fields: {
            key: {
              type: Types.STRING
            }
          }
        }
      });

      expect(schema.matches([])).to.be.false;
    });

  });

  describe('errors', () => {
    it('should record errors when verification fails', () => {
      const schema = Schema.create({
        type: Types.EXACT,
        value: 'hello'
      });

      schema.matches('notamatch');

      expect(schema.errors()).is.not.null;
    });
  });
});