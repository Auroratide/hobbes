const path = require('path');
const { expect } = require('chai');
const hobbes = require('..');
const api = require('./api');

describe('Hobbes Functional Test', () => {
  const contract = hobbes.contract({
    consumer: 'FunctionalConsumer',
    provider: 'FunctionalProvider',
    port: 4567,
    directory: path.resolve(__dirname, '..', 'contracts')
  });

  describe('GET /endpoint', () => {
    const EXPECTED_BODY = {
      id: '12345',
      title: 'Title'
    };

    before(() => {
      contract.interaction({
        request: {
          method: 'GET',
          path: '/endpoint'
        },
        response: {
          status: 200,
          body: EXPECTED_BODY
        }
      });
    });

    it('should get the title', () => {
      return api.getTitle().then(title => {
        expect(title).to.equal('Title');
      });
    });
  });

  after(() => contract.finalize());
});