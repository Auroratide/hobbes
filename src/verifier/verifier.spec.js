const { expect } = require('chai');
const axios = require('axios');
const nock = require('nock');
const td = require('testdouble');
const Schema = require('../schema');
const ErrorCodes = require('../constants/error-codes');
const Methods = require('../constants/methods');
const {
  reportConnectionError,
  verifyStatusCode,
  verifyBodyMatches
} = require('./verifier.helpers');
const { shouldReject } = require('../../test/helpers');

describe('Verifier', () => {
  const BASE_URL = 'http://localhost:4567';

  describe('helpers', () => {
    describe('reportConnectionError', () => {
      const req = {};

      it('should throw when the error is a connection error', () => {
        const err = {
          code: ErrorCodes.CONNECTION_REFUSED,
          config: { url: '' }
        };

        expect(() => reportConnectionError(req)(err)).to.throw();
      });

      it('should return the response when the error is anything but a connection error', () => {
        const err = {
          code: 'anything else',
          response: {}
        };

        expect(reportConnectionError(req)(err)).to.equal(err.response);
      });
    });

    describe('verifyStatusCode', () => {
      const req = {};
      
      it('should throw when the status do not match', () => {
        const res = { status: 404 };

        expect(() => verifyStatusCode(200, req)(res)).to.throw();
      });

      it('should return the response when the statuses match', () => {
        const res = { status: 200 };

        expect(verifyStatusCode(200, req)(res)).to.equal(res);
      });
    });

    describe('verifyBodiesMatch', () => {
      let schema;
      let createSchema;
      const req = {};

      beforeEach(() => {
        schema = { matches: td.function(), errors: td.function() };
        createSchema = td.replace(Schema, 'create');
      });
      
      it('should throw when the bodies do not match', () => {
        const body = {};
        const res = { data: body };
        td.when(createSchema(body)).thenReturn(schema);
        td.when(schema.matches(body)).thenReturn(false);
        td.when(schema.errors()).thenReturn({
          details: [],
          _object: {}
        });

        expect(() => verifyBodyMatches({ notMatching: true }, req)(res)).to.throw();
      });

      it('should return the response when the bodies match', () => {
        const body = {};
        const res = { data: body };
        td.when(createSchema(body)).thenReturn(schema);
        td.when(schema.matches(body)).thenReturn(true);

        expect(verifyBodyMatches(body, req)(res)).to.equal(res);
      });
    });
  });

  describe('verify', () => {
    let helpers;
    let verifier;
    let request;
    let response;

    const http = axios.create({
      baseURL: BASE_URL
    });

    const createContract = () => { 
      return { interactions: {} };
    };

    const createInteraction = () => {
      const interceptor = nock(BASE_URL)
        .intercept(request.path, request.method)
        .reply(response.status, response.body);

      return {
        request: Object.assign({}, request),
        response: Object.assign({}, response),
        interceptor
      };
    };

    beforeEach(() => {
      helpers = td.replace('./verifier.helpers');
      const Verifier = require('./verifier');

      verifier = new Verifier(http);

      request = {
        method: Methods.GET,
        path: '/endpoint'
      };

      response = {
        status: 200,
        body: { field: 'value' }
      };
    });

    it('should throw when the contract has null interactions', () => {
      const contract = {};
      expect(() => verifier.verify(contract)).to.throw();
    });

    it('should succeed when the contract has no interactions', () => {
      const contract = createContract();
      return verifier.verify(contract);
    });

    it('should verify a single interaction', () => {
      const contract = createContract();
      contract.interactions['GET /endpoint'] = createInteraction();

      return verifier.verify(contract).then(() => {
        expect(contract.interactions['GET /endpoint'].interceptor.isDone()).to.be.true;
      });
    });

    it('should verify multiple interactions', () => {
      const contract = createContract();
      request.path = '/endpoint/1';
      contract.interactions['GET /endpoint/1'] = createInteraction();
      request.path = '/endpoint/2';
      contract.interactions['GET /endpoint/2'] = createInteraction();

      return verifier.verify(contract).then(() => {
        expect(contract.interactions['GET /endpoint/1'].interceptor.isDone()).to.be.true;
        expect(contract.interactions['GET /endpoint/2'].interceptor.isDone()).to.be.true;
      });
    });

    it('should throw when the status does not match', () => {
      const contract = createContract();

      const expectedError = new Error();
      const verifyStatusCode = td.function();
      td.when(helpers.verifyStatusCode(td.matchers.anything(), td.matchers.anything())).thenReturn(verifyStatusCode);
      td.when(verifyStatusCode(td.matchers.anything())).thenThrow(expectedError);

      contract.interactions['GET /endpoint'] = createInteraction();

      return shouldReject(verifier.verify(contract)).then(error => {
        expect(error.errors).to.contain(expectedError);
      });
    });

    it('should throw when the body does not match', () => {
      const contract = createContract();

      const expectedError = new Error();
      const verifyBodyMatches = td.function();
      td.when(helpers.verifyBodyMatches(td.matchers.anything(), td.matchers.anything())).thenReturn(verifyBodyMatches);
      td.when(verifyBodyMatches(td.matchers.anything())).thenThrow(expectedError);

      contract.interactions['GET /endpoint'] = createInteraction();

      return shouldReject(verifier.verify(contract)).then(error => {
        expect(error.errors).to.contain(expectedError);
      });
    });

    it('should throw when the connection to server failed', () => {
      const contract = createContract();

      const expectedError = new Error();
      const reportConnectionError = td.function();
      td.when(helpers.reportConnectionError(td.matchers.anything())).thenReturn(reportConnectionError);
      td.when(reportConnectionError(td.matchers.anything())).thenThrow(expectedError);

      contract.interactions['GET /endpoint'] = createInteraction();
      nock.cleanAll();

      return shouldReject(verifier.verify(contract)).then(error => {
        expect(error.errors).to.contain(expectedError);
      });
    });

    afterEach(() => nock.cleanAll());
  });

  afterEach(() => td.reset());
});