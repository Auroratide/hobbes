const { expect } = require('chai');
const td = require('testdouble');
const Contract = require('./contract');
const fs = require('./utils/fs');

describe('hobbes', () => {
  describe('contract', () => {
    const hobbes = require('./hobbes');

    it('should create an empty contract', () => {
      expect(hobbes.contract({})).to.be.an.instanceof(Contract);
    });
  });

  describe('verify', () => {
    let hobbes;
    let Verifier;

    beforeEach(() => {
      Verifier = td.replace('./verifier');
      hobbes = require('./hobbes');
    });

    it('should read the pact file into the verify step', () => {
      const contract = { interactions: {} };

      const readJson = td.replace(fs, 'readJson');
      td.when(readJson('file/path')).thenResolve(contract);

      return hobbes.verify({
        baseURL: 'http://localhost:4567',
        contract: 'file/path'
      }).then(() => {
        td.verify(Verifier.prototype.verify(contract));
      });
    });
  });

  describe('sameTypeAs', () => {
    const hobbes = require('./hobbes');
    it('returns the appropriate hobbes matcher', () => {
      expect(hobbes.sameTypeAs('hello')).to.deep.equal({
        __hobbes_matcher__: {
          value: 'hello'
        }
      });
    });
  });

  afterEach(() => td.reset());
});
