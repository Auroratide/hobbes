const path = require('path');
const { expect, assert } = require('chai');
const hobbes = require('..');
const api = require('./api');
const server = require('./server');

describe('Failed Verification Test', () => {
  const CONTRACT_FILE_DIR = path.resolve(__dirname, '..', 'contracts');

  const contract = hobbes.contract({
    consumer: 'FunctionalConsumerFailure',
    provider: 'FunctionalProvider',
    port: 4567,
    directory: CONTRACT_FILE_DIR
  });

  describe('GET /endpoint', () => {
    const EXPECTED_BODY = hobbes.is.object({
      id: hobbes.is('12345'),
      title: hobbes.is('Title'),
      tagline: hobbes.is.string('tagline'),
      likes: hobbes.is.number(50),
      hidden: hobbes.is.boolean(true),
      comments: hobbes.is.arrayOf(hobbes.is.object({
        id: hobbes.is.number(1),
        text: hobbes.is.string('Hello world')
      }))
    });

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
        expect(post.likes).to.equal(50);
        expect(post.hidden).to.be.true;
        expect(post.comments[0]).to.deep.equal({
          id: 1,
          text: 'Hello world'
        });
      });
    });
  });

  after(() => {
    let serverInstance;
    return contract.finalize().then(() => {
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
    });;
  });
});