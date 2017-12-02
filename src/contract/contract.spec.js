const path = require('path');
const fs = require('fs');
const { expect } = require('chai');
const axios = require('axios');
const Contract = require('./contract');
const Types = require('../constants/types');

describe('Contract', () => {

  describe('interaction', () => {
    it('should add an interaction', () => {
      const c = new Contract({ port: 4567 });
      c.interaction({
        request: {
          method: 'GET',
          path: '/interaction/1'
        },
        response: {
          status: 200,
          body: {
            type: Types.OBJECT,
            value: {
              super: 'man'
            },
            fields: {
              super: {
                type: 'string'
              }
            }
          }
        }
      });

      return axios.get('http://localhost:4567/interaction/1').then(res => {
        expect(res.status).to.equal(200);
        expect(res.data.super).to.equal('man');
      });
    });

    it('should add an interaction when a body is not defined', () => {
      const c = new Contract({ port: 4567 });
      c.interaction({
        request: {
          method: 'GET',
          path: '/interaction/1'
        },
        response: {
          status: 204
        }
      });

      return axios.get('http://localhost:4567/interaction/1').then(res => {
        expect(res.status).to.equal(204);
        expect(res.data).to.have.length(0);
      });
    });

    it('should add an interaction when request body is defined', () => {
      const c = new Contract({ port: 4567 });
      c.interaction({
        request: {
          method: 'POST',
          path: '/interaction',
          body: {
            type: Types.OBJECT,
            value: {
              super: 'man'
            },
            fields: {
              super: {
                type: 'string'
              }
            }
          }
        },
        response: {
          status: 201,
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

      return axios.post('http://localhost:4567/interaction', { super: 'man' }).then(res => {
        expect(res.status).to.equal(201);
        expect(res.data.super).to.equal('woman');
      });
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
            super: 'man'
          }
        }
      });
    });

    const createContract = () => new Contract({
      consumer: 'ContractConsumer',
      provider: 'ContractProvider',
      port: 4567,
      directory: path.resolve(__dirname, '..', 'contracts')
    });

    it('verifies interceptors', () => {
      expect(() => contract.finalize()).to.throw();
      return axios.get('http://localhost:4567/power').then(res => {
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
});