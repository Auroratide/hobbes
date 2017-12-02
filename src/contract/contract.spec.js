const path = require('path');
const fs = require('fs');
const nock = require('nock');
const { expect } = require('chai');
const axios = require('axios');
const Contract = require('./contract');
const Types = require('../constants/types');
const Methods = require('../constants/methods');
const {
  withoutInterceptors,
  stubHttpRequest
} = require('./contract.helpers');
const td = require('testdouble');

describe('Contract', () => {
  const PORT = 4567;

  describe('helpers', () => {
    describe('withoutInterceptors', () => {
      it('should return empty object when given empty object', () => {
        expect(withoutInterceptors({})).to.deep.equal({});
      });

      it('should include only the request and response objects', () => {
        const result = withoutInterceptors({
          field: {
            request: {},
            response: {},
            interceptor: {}
          }
        });

        expect(result.field).to.have.property('request');
        expect(result.field).to.have.property('response');
        expect(result.field).to.not.have.property('interceptor');
      });

      it('should extract from all keys', () => {
        const result = withoutInterceptors({
          field1: { interceptor: {} },
          field2: { interceptor: {} }
        });

        expect(result.field1).to.not.have.property('interceptor');
        expect(result.field2).to.not.have.property('interceptor');
      });
    });

    describe('stubHttpRequest', () => {
      let req;
      let res;

      beforeEach(() => {
        req = {
          path: '/interaction/1',
          method: Methods.GET
        };
        res = {
          status: 200
        };
      });

      it('should throw when request lacks path', () => {
        req.path = undefined;
        expect(() => stubHttpRequest(PORT, req, res)).to.throw();
      });

      it('should throw when request lacks method', () => {
        req.method = undefined;
        expect(() => stubHttpRequest(PORT, req, res)).to.throw();
      });

      it('should throw when response lacks status', () => {
        res.status = undefined;
        expect(() => stubHttpRequest(PORT, req, res)).to.throw();
      });

      it('should throw when request has body without a value', () => {
        req.body = {};
        expect(() => stubHttpRequest(PORT, req, res)).to.throw();
      });

      it('should throw when response has body without a value', () => {
        res.body = {};
        expect(() => stubHttpRequest(PORT, req, res)).to.throw();
      });

      it('should reply when a GET request is made', () => {
        stubHttpRequest(PORT, req, res);

        return axios.get(`http://localhost:${PORT}/interaction/1`).then(res => {
          expect(res.status).to.equal(200);
        });
      });

      it('should reply with the given response body when a GET request is made', () => {
        res.body = { value: { name: 'Winter' } };
        stubHttpRequest(PORT, req, res);

        return axios.get(`http://localhost:${PORT}/interaction/1`).then(res => {
          expect(res.status).to.equal(200);
          expect(res.data.name).to.equal('Winter');
        });
      });

      it('should reply with the given response body when a POST request with a matching body is made', () => {
        req.method = Methods.POST;
        req.body = { value: { name: 'Winter' } };
        res.status = 201;
        res.body = { value: { id: '123' } };
        stubHttpRequest(PORT, req, res);

        return axios.post(`http://localhost:${PORT}/interaction/1`, { name: 'Winter' }).then(res => {
          expect(res.status).to.equal(201);
          expect(res.data.id).to.equal('123');
        });
      });

      it('should return an interceptor for the stubbed request', () => {
        expect(stubHttpRequest(PORT, req, res)).to.exist;
      });

      afterEach(() => {
        nock.cleanAll();
      });
    });
  });

  describe('interaction', () => {
    let helpers;
    let contract;
    let request;
    let response;

    beforeEach(() => {
      helpers = td.replace('./contract.helpers');
      const Contract = require('./contract');

      contract = new Contract({ port: PORT });
      request = {
        path: '/path',
        method: Methods.GET
      };
      response = {};
    });

    it('should throw when request is missing', () => {
      expect(() => contract.interaction({ response })).to.throw();
    });

    it('should throw when response is missing', () => {
      expect(() => contract.interaction({ request })).to.throw();
    });

    it('should throw when request is missing path', () => {
      request.path = undefined;
      expect(() => contract.interaction({ request, response })).to.throw();
    });

    it('should throw when request is missing method', () => {
      request.method = undefined;
      expect(() => contract.interaction({ request, response })).to.throw();
    });

    it('should add interaction details to list of interactions', () => {
      contract.interaction({ request, response });

      expect(contract.interactions[`${Methods.GET} /path`].request).to.equal(request);
      expect(contract.interactions[`${Methods.GET} /path`].response).to.equal(response);
    });

    it('should include stub interceptor in list of interactions', () => {
      const interceptor = {};
      td.when(helpers.stubHttpRequest(PORT, request, response)).thenReturn(interceptor);
      contract.interaction({ request, response });

      expect(contract.interactions[`${Methods.GET} /path`].interceptor).to.equal(interceptor);
    });

  });

  describe('finalize', () => {
    let contract;

    beforeEach(() => {
      contract = new Contract({
        consumer: 'ContractConsumer',
        provider: 'ContractProvider',
        port: 4567,
        directory: path.resolve(__dirname, '../..', 'contracts')
      });

      contract.interaction({
        request: {
          method: 'GET',
          path: '/power'
        },
        response: {
          status: 200,
          body: {
            type: Types.OBJECT,
            value: {
              super: 'woman'
            },
            fields: {
              super: {
                type: 'string'
              }
            }
          }
        }
      });
    });

    it('verifies interceptors', () => {
      expect(() => contract.finalize()).to.throw();
      return axios.get('http://localhost:4567/power').then(() => {
        expect(() => contract.finalize()).to.not.throw();
      });
    });

    it('creates a contract file in the correct directory', () => {
      return axios.get('http://localhost:4567/power').then(() => {
        return contract.finalize();
      }).then(() => {
        const files = fs.readdirSync(path.resolve(__dirname, '..', '..', 'contracts'));
        expect(files).to.contain('ContractConsumer-ContractProvider.json');
      });
    });
  });

  afterEach(() => td.reset());
});