const path = require('path');
const nock = require('nock');
const fs = require('../utils/fs');
const ObjectMatcher = require('../object-matcher');

function Verifier(http) {
  this.http = http;
}

Verifier.prototype.verify = function(contract) {
  return Promise.all(Object.keys(contract.interactions).map(key => {
    const request = contract.interactions[key].request;
    const response = contract.interactions[key].response;

    return this.http({
      method: request.method,
      url: request.path,
      data: request.body
    }).catch(err => {
      return err.response;
    }).then(res => {
      if(res.status !== response.status) {
        throw new Error(`Expected ${res.status} from provider to be ${response.status}`);
      }

      if(!(new ObjectMatcher(res.data).matches(response.body))) {
        throw new Error('Expected bodies to match');
      }
    });
  }));
};

module.exports = Verifier;