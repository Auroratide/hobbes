const path = require('path');
const nock = require('nock');
const fs = require('../utils/fs');
const Schema = require('../schema');
const { VerificationError } = require('../errors');

function Verifier(http) {
  this.http = http;
}

Verifier.prototype.verify = function(contract) {
  return Promise.all(Object.keys(contract.interactions).map(key => {
    const request = contract.interactions[key].request;
    const expectedResponse = contract.interactions[key].response;

    return this.http({
      method: request.method,
      url: request.path,
      data: request.body
    }).catch(err => {
      return err.response;
    }).then(res => {
      if(res.status !== expectedResponse.status) {
        throw new Error(`Expected ${res.status} from provider to be ${expectedResponse.status}`);
      }

      const schema = Schema.create(expectedResponse.body);

      if(!schema.matches(res.data)) {
        throw new VerificationError(schema.errors().details, schema.errors()._object);
      }
    });
  }));
};

module.exports = Verifier;