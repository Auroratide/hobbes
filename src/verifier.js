const path = require('path');
const nock = require('nock');
const fs = require('./utils/fs');

function Verifier(http) {
  this.http = http;
}

Verifier.prototype.verify = function(contract) {
  return Promise.all(Object.keys(contract.interactions).map(key => {
    const request = contract.interactions[key].request;
    const response = contract.interactions[key].response;

    return this.http({
      method: request.method,
      url: request.path
    }).catch(err => {
      return err.response;
    }).then(res => {
      if(res.status !== response.status) {
        throw new Error(`Expected ${res.status} from provider to be ${response.status}`);
      }
    });
  }));
};

module.exports = Verifier;