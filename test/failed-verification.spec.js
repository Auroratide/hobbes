const path = require('path');
const { expect, assert } = require('chai');
const hobbes = require('..');
const api = require('./api');
const server = require('./server');

describe('Failed Verification Test', () => {
  const CONTRACT_FILE_DIR = path.resolve(__dirname, '..', 'contracts');

  let contract;
  const newContract = () => {
    contract = hobbes.contract({
      consumer: 'FunctionalConsumerFailure',
      provider: 'FunctionalProvider',
      port: 4567,
      directory: CONTRACT_FILE_DIR
    });
  };

  const test = (name, f) => it(name, () => {
    let serverInstance;
    return f().then(() => {
      return contract.finalize();
    }).then(() => {
      serverInstance = server.listen(7654);
      return hobbes.verify({
        baseURL: 'http://localhost:7654',
        contract: path.join(CONTRACT_FILE_DIR, 'FunctionalConsumerFailure-FunctionalProvider.json')
      });
    }).then(() => {
      serverInstance.close();
      throw new Error('Passed verification, but should have failed!');
    }, err => {
      serverInstance.close();
      console.log(err);
    });
  });

  describe('GET', () => {
    const createInteraction = expectedBody => contract.interaction({
      request: {
        method: 'GET',
        path: '/endpoint'
      },
      response: {
        status: 200,
        body: expectedBody
      }
    });

    describe('Expecting a number', () => {
      before(() => {
        newContract();
        createInteraction(hobbes.is.object({
          id: hobbes.is.number(12345)
        }));
      });
  
      test('should fail when actual is not a number', () => {
        return api.getPost();
      });
    });

    describe('Expecting a boolean', () => {
      before(() => {
        newContract();
        createInteraction(hobbes.is.object({
          id: hobbes.is.boolean(true)
        }));
      });
  
      test('should fail when actual is not a boolean', () => {
        return api.getPost();
      });
    });

    describe('Expecting a string', () => {
      before(() => {
        newContract();
        createInteraction(hobbes.is.object({
          likes: hobbes.is.string('12345')
        }));
      });
  
      test('should fail when actual is not a string', () => {
        return api.getPost();
      });
    });

    describe.skip('Expecting a missing key', () => {
      before(() => {
        newContract();
        createInteraction(hobbes.is.object({
          notakey: hobbes.is.string('')
        }));
      });
  
      test('should fail when actual does not contain the key', () => {
        return api.getPost();
      });
    });
  });
});