const { expect } = require('chai');
const td = require('testdouble');
const Contract = require('./contract');
const fs = require('./utils/fs');

describe('hobbes', () => {
  describe('contract', () => {
    const hobbes = require('./hobbes');
    let options;

    beforeEach(() => {
      options = {
        consumer: 'consumer',
        provider: 'provider',
        port: 4567,
        directory: '.'
      };
    });

    it('should create an empty contract', () => {
      expect(hobbes.contract(options)).to.be.an.instanceof(Contract);
    });

    it('should throw when options is missing consumer', () => {
      options.consumer = undefined;
      expect(() => hobbes.contract(options)).to.throw();
    });

    it('should throw when options is missing provider', () => {
      options.provider = undefined;
      expect(() => hobbes.contract(options)).to.throw();
    });

    it('should throw when options is missing port', () => {
      options.port = undefined;
      expect(() => hobbes.contract(options)).to.throw();
    });

    it('should throw when options is missing directory', () => {
      options.directory = undefined;
      expect(() => hobbes.contract(options)).to.throw();
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
    
    it('should throw when options is missing baseURL', () => {
      expect(() => hobbes.verify({ contract: 'c' })).to.throw();
    });

    it('should throw when options is missing contract', () => {
      expect(() => hobbes.verify({ baseURL: 'c' })).to.throw();
    });
  });

  describe('is', () => {
    it('returns an is instance', () => {
      expect(require('./hobbes').is).to.not.be.null;
    });
  });

  afterEach(() => td.reset());
});
