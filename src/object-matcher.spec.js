const { expect } = require('chai');
const ObjectMatcher = require('./object-matcher');

describe('Object Matcher', () => {
  describe('primitives', () => {
    it('should return true for matching strings', () => {
      expect(new ObjectMatcher('string').matches('string')).to.be.true;
    });

    it('should return false for mismatching strings', () => {
      expect(new ObjectMatcher('mismatch').matches('string')).to.be.false;
    });

    it('should return true for matching numbers', () => {
      expect(new ObjectMatcher(5.6).matches(5.6)).to.be.true;
    });

    it('should return false for mismatching numbers', () => {
      expect(new ObjectMatcher(-1.7).matches(5.6)).to.be.false;
    });

    it('should return true for matching bools', () => {
      expect(new ObjectMatcher(true).matches(true)).to.be.true;
      expect(new ObjectMatcher(false).matches(false)).to.be.true;
    });

    it('should return false for mismatching bools', () => {
      expect(new ObjectMatcher(true).matches(false)).to.be.false;
      expect(new ObjectMatcher(false).matches(true)).to.be.false;
    });
  });

  describe('object', () => {
    let obj;
    let model;

    beforeEach(() => {
      obj = {
        field: 'value'
      };

      model = {
        field: 'value'
      };
    });

    it('should return true when matching against an empty object', () => {
      model = {};
      expect(new ObjectMatcher(obj).matches(model)).to.be.true;
    });

    it('should return false when the object does not contain all the fields in the model object', () => {
      obj = {};
      expect(new ObjectMatcher(obj).matches(model)).to.be.false;
    });

    it('should return false when the object does not match all the fields in the model object', () => {
      obj.field = 'mismatch';
      expect(new ObjectMatcher(obj).matches(model)).to.be.false;
    });

    it('should return true when the object has extraneous fields and the rest of the fields match', () => {
      obj.extraneous = 'value';
      expect(new ObjectMatcher(obj).matches(model)).to.be.true;
    });

    it('should match nested objects', () => {
      obj.field = { nested: true };
      model.field = { nested: true };

      expect(new ObjectMatcher(obj).matches(model)).to.be.true;
    });
  });

  describe('arrays', () => {
    let obj;
    let model;

    beforeEach(() => {
      obj = [];
      model = [];
    });

    it('should match each primitive in the array', () => {
      obj = ['str 1', 1.2, true];
      model = ['str 1', 1.2, true];
      expect(new ObjectMatcher(obj).matches(model)).to.be.true;
    });

    it('should return false if any primitive in the array mismatches', () => {
      obj = ['str 1', 1.3, true];
      model = ['str 1', 1.2, true];
      expect(new ObjectMatcher(obj).matches(model)).to.be.false;
    });

    it('should match each object in the array', () => {
      obj = [{}, { value: 1 }];
      model = [{}, { value: 1 }];
      expect(new ObjectMatcher(obj).matches(model)).to.be.true;
    });

    it('should return false if any primitive in the array mismatches', () => {
      obj = [{}, { value: 1 }];
      model = [{}, { value: 2 }];
      expect(new ObjectMatcher(obj).matches(model)).to.be.false;
    });
  });
});