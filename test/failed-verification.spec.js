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

    describe('Expecting an exact value', () => {
      before(() => {
        newContract();
        createInteraction(hobbes.is.object({
          id: hobbes.is('incorrect!')
        }));
      });
  
      test('should fail when actual is not the correct value', () => {
        return api.getPost();
      });
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

    describe('Expecting an object', () => {
      before(() => {
        newContract();
        createInteraction(hobbes.is.object({
          id: hobbes.is.object({})
        }));
      });
  
      test('should fail when actual is not an object', () => {
        return api.getPost();
      });
    });

    describe('Expecting a missing key', () => {
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

    describe('Expecting a key to be the correct type', () => {
      before(() => {
        newContract();
        createInteraction(hobbes.is.object({
          id: hobbes.is.number(0)
        }));
      });
  
      test('should fail when actual does not contain key of the correct type', () => {
        return api.getPost();
      });
    });

    describe('Expecting items in array to be correct', () => {
      before(() => {
        newContract();
        createInteraction(hobbes.is.object({
          comments: hobbes.is.arrayOf(hobbes.is.string(''))
        }));
      });
  
      test('should fail when at least one item in array does not match schema', () => {
        return api.getPost();
      });
    });

    describe('Expecting status to be correct', () => {
      before(() => {
        newContract();
        contract.interaction({
          request: {
            method: 'GET',
            path: '/endpoint'
          },
          response: {
            status: 204
          }
        })
      });
  
      test('should fail when status does not match expected status', () => {
        return api.getPost();
      });
    });
  });

  describe('POST', () => {
    const createInteraction = (expectedReqBody, expectedResBody) => contract.interaction({
      request: {
        method: 'POST',
        path: '/endpoint',
        body: expectedReqBody
      },
      response: {
        status: 201,
        body: expectedResBody
      }
    });

    it('should fail if request made does not match expected body', () => {
      newContract();
      createInteraction(hobbes.is.object({
        id: hobbes.is.string('123')
      }), hobbes.is.object({
        title: hobbes.is.string('title')
      }));

      return api.postTitle('title').then(title => {
        expect(title).to.equal('title');
      }).then(() => {
        throw new Error('Passed verification, but should have failed!');
      }, err => {});
    });
  });
});