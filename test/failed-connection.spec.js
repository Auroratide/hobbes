const path = require('path');
const hobbes = require('..');
const api = require('./api');

describe('Failed Connection Test', () => {
  const CONTRACT_FILE_DIR = path.resolve(__dirname, '..', 'contracts');

  const contract = hobbes.contract({
    consumer: 'FunctionalConsumerConnection',
    provider: 'FunctionalProvider',
    port: 4567,
    directory: CONTRACT_FILE_DIR
  });

  before(() => {
    contract.interaction({
      request: {
        method: 'GET',
        path: '/endpoint'
      },
      response: {
        status: 200
      }
    });
  });

  it('should fail when verifying against a server that is down', () => {
    return api.getPost();
  });

  after(() => {
    return contract.finalize().then(() => {
      return hobbes.verify({
        baseURL: 'http://localhost:7654',
        contract: path.join(CONTRACT_FILE_DIR, 'FunctionalConsumerConnection-FunctionalProvider.json')
      });
    }).then(() => {
      throw new Error('Passed verification, but should have failed!');
    }, () => {});
  });
});