const { expect } = require('chai');
const axios = require('axios');
const Contract = require('./contract');

describe('Contract', () => {
  it('should work', () => {
    const c = new Contract({ port: 4567 });
    c.interaction({
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

    return axios.get('http://localhost:4567/power').then(res => {
      expect(res.status).to.equal(200);
      expect(res.data.super).to.equal('man');
    });
  });

  it('verifies interceptors', () => {
    const contract = new Contract({ port: 4567 });
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

    expect(() => contract.finalize()).to.throw();
    return axios.get('http://localhost:4567/power').then(res => {
      expect(() => contract.finalize()).to.not.throw();
    });
  });
});