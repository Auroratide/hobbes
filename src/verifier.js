const path = require('path');
const nock = require('nock');
const fs = require('./utils/fs');

function Verifier(http) {
  this.http = http;
}

Verifier.prototype.verify = function(contract) {
  return Promise.all(Object.keys(contract.interactions).map(key => {
    const request = contract.interactions[key].request;

    return this.http({
      method: request.method,
      url: request.path
    });
  }));
};

module.exports = Verifier;