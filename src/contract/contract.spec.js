const path = require('path');
const fs = require('fs');
const { expect } = require('chai');
const axios = require('axios');
const Contract = require('./contract');

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
            super: 'man'
          }
        }
      });

      return axios.get('http://localhost:4567/interaction/1').then(res => {
        expect(res.status).to.equal(200);
        expect(res.data.super).to.equal('man');
      });
    });

    it('should add an interaction using the hobbes matcher value in the response', () => {
      const c = new Contract({ port: 4567 });
      c.interaction({
        request: {
          method: 'GET',
          path: '/interaction/2'
        },
        response: {
          status: 200,
          body: {
            super: 'man',
            matcher: {
              __hobbes__: {
                value: 42
              }
            },
            objWithMatcher: {
              matcher: {
                __hobbes__: {
                  value: 52
                }
              }
            },
            matcherWithMatcher: {
              matcher: {
                __hobbes__: {
                  value: 62
                }
              }
            }
          }
        }
      });

      return axios.get('http://localhost:4567/interaction/2').then(res => {
        expect(res.status).to.equal(200);
        expect(res.data.matcher).to.equal(42);
        expect(res.data.objWithMatcher.matcher).to.equal(52);
        expect(res.data.matcherWithMatcher.matcher).to.equal(62);
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