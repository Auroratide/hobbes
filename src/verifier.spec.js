const { expect } = require('chai');
const axios = require('axios');
const nock = require('nock');
const Verifier = require('./verifier');

describe('Verifier', () => {
  const BASE_URL = 'http://localhost:4567';
  let verifier;
  const request = axios.create({
    baseURL: BASE_URL
  });

  beforeEach(() => {
    verifier = new Verifier(request);
  });

  describe('verify', () => {
    it('should succeed when the contract has no interactions', () => {
      const contract = { interactions: {} };

      return verifier.verify(contract);
    });

    it('should verify a single interaction', () => {
      const responseBody = { field: 'value' };
      const PATH = '/endpoint';

      const interaction = nock(BASE_URL)
        .get(PATH)
        .reply(200, responseBody);

      const contract = {
        interactions: {
          'GET /endpoint': {
            request: {
              method: 'GET',
              path: PATH
            },
            response: {
              status: 200,
              body: responseBody
            }
          }
        }
      };

      return verifier.verify(contract).then(() => {
        expect(interaction.isDone()).to.be.true;
      });
    });

    it('should verify multiple interactions', () => {
      const path = value => `/endpoint/${value}`;
      const responseBody = value => { return { field: value } };

      const firstInteraction = nock(BASE_URL)
        .get(path(1))
        .reply(200, responseBody(1));

      const secondInteraction = nock(BASE_URL)
        .get(path(2))
        .reply(200, responseBody(2));

      const contract = {
        interactions: {
          'GET /endpoint/1': {
            request: {
              method: 'GET',
              path: path(1)
            },
            response: {
              status: 200,
              body: responseBody(1)
            }
          },
          'GET /endpoint/2': {
            request: {
              method: 'GET',
              path: path(2)
            },
            response: {
              status: 200,
              body: responseBody(2)
            }
          }
        }
      };

      return verifier.verify(contract).then(() => {
        expect(firstInteraction.isDone()).to.be.true;
        expect(secondInteraction.isDone()).to.be.true;
      });
    });
  });
});