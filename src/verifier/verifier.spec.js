const { expect } = require('chai');
const axios = require('axios');
const nock = require('nock');
const td = require('testdouble');
const Verifier = require('./verifier');
const Schema = require('../schema');

describe('Verifier', () => {
  const BASE_URL = 'http://localhost:4567';
  let createSchema;
  let schema;
  let verifier;
  const request = axios.create({
    baseURL: BASE_URL
  });

  const createContract = () => { return { interactions: {} }};

  const createGet = (path, responseBody) => {
    td.when(createSchema(responseBody)).thenReturn(schema);
    td.when(schema.matches(responseBody)).thenReturn(true);
    const interceptor = nock(BASE_URL)
      .get(path)
      .reply(200, responseBody);

    return {
      request: {
        method: 'GET',
        path
      },
      response: {
        status: 200,
        body: responseBody
      },
      nock: interceptor
    };
  };

  beforeEach(() => {
    schema = { matches: td.function() };
    createSchema = td.replace(Schema, 'create');
    verifier = new Verifier(request);
  });

  describe('verify', () => {
    it('should succeed when the contract has no interactions', () => {
      const contract = createContract();
      return verifier.verify(contract);
    });

    it('should verify a single interaction', () => {
      const contract = createContract();
      contract.interactions['GET /endpoint'] = createGet('/endpoint', { field: 'value' });

      return verifier.verify(contract).then(() => {
        expect(contract.interactions['GET /endpoint'].nock.isDone()).to.be.true;
      });
    });

    it('should verify multiple interactions', () => {
      const contract = createContract();
      contract.interactions['GET /endpoint/1'] = createGet('/endpoint/1', { field: 1 });
      contract.interactions['GET /endpoint/2'] = createGet('/endpoint/2', { field: 2 });

      return verifier.verify(contract).then(() => {
        expect(contract.interactions['GET /endpoint/1'].nock.isDone()).to.be.true;
        expect(contract.interactions['GET /endpoint/1'].nock.isDone()).to.be.true;
      });
    });

    it('should throw when the status does not match', () => {
      const contract = createContract();

      const interaction = nock(BASE_URL)
        .get('/bad-endpoint')
        .reply(404, {});
      contract.interactions['GET /bad-endpoint'] = createGet('/bad-endpoint', { field: 'value' });

      return new Promise((resolve, reject) => {
        verifier.verify(contract).then(() => {
          reject('Promise was resolved but should have been rejected');
        }).catch(err => {
          resolve();
        });
      });
    });

    it('should throw when the response body does not match', () => {
      const contract = createContract();
      contract.interactions['GET /endpoint'] = createGet('/endpoint', { field: 'value' });
      td.when(schema.matches({ field: 'value' })).thenReturn(false);

      return new Promise((resolve, reject) => {
        verifier.verify(contract).then(() => {
          reject('Promise was resolved but should have been rejected');
        }).catch(err => {
          resolve();
        });
      });
    });
  });

  afterEach(() => td.reset());
});