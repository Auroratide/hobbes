const { expect } = require('chai');
const td = require('testdouble');
const { validateParam } = require('./helpers');

describe('helpers', () => {
  describe('validateParam', () => {
    it('should not throw if the validation produces no errors', () => {
      const param = 'hello';
      const validate = td.function();
      const schema = { validate };
      td.when(validate(param)).thenReturn({ error: null });

      expect(() => validateParam(param, schema)).to.not.throw();
    });

    it('should throw if the validation produces errors', () => {
      const param = 'hello';
      const validate = td.function();
      const schema = { validate };
      td.when(validate(param)).thenReturn({ error: 'error!' });

      expect(() => validateParam(param, schema)).to.throw();
    });
  });
});