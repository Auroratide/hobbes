const path = require('path');
const { expect, assert } = require('chai');
const hobbes = require('..');
const api = require('./api');
const server = require('./server');

describe('Hobbes Functional Test', () => {
  const CONTRACT_FILE_DIR = path.resolve(__dirname, '..', 'contracts');

  const contract = hobbes.contract({
    consumer: 'FunctionalConsumer',
    provider: 'FunctionalProvider',
    port: 4567,
    directory: CONTRACT_FILE_DIR
  });

  describe('GET /endpoint', () => {
    const EXPECTED_BODY = {
      id: '12345',
      title: 'Title',
      tagline: hobbes.sameTypeAs('tagline')
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

    it('should get the post details', () => {
      return api.getPost().then(post => {
        expect(post.title).to.equal('Title');
        expect(post.tagline).to.equal('tagline');
      });
    });
  });

  describe('POST /endpoint', () => {
    const REQUEST = {
      title: 'Cool Title'
    };

    const EXPECTED_BODY = {
      id: '12346',
      title: 'Cool Title'
    };

    before(() => {
      contract.interaction({
        request: {
          method: 'POST',
          path: '/endpoint',
          body: REQUEST
        },
        response: {
          status: 201,
          body: EXPECTED_BODY
        }
      });
    });

    it('should post the title', () => {
      return api.postTitle('Cool Tilte').then(title => {
        expect(title).to.equal('Cool Title');
      });
    });
  });

  after(() => {
    let serverInstance;
    return contract.finalize().then(() => {
      serverInstance = server.listen(7654);
      return hobbes.verify({
        baseURL: 'http://localhost:7654',
        contract: path.join(CONTRACT_FILE_DIR, 'FunctionalConsumer-FunctionalProvider.json')
      });
    }).then(() => {
      serverInstance.close();
    }).catch(err => {
      serverInstance.close();
      throw err;
    });;
  });
});