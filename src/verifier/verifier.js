const {
  reportConnectionError,
  verifyStatusCode,
  verifyBodyMatches
} = require('./verifier.helpers');

const Verifier = function(http) {
  this.http = http;
};

Verifier.prototype.verify = function(contract) {
  return Promise.all(Object.keys(contract.interactions).map(key => {
    const requestInfo = contract.interactions[key].request;
    const expectedResponse = contract.interactions[key].response;

    const request = {
      method: requestInfo.method,
      url: requestInfo.path,
      data: requestInfo.body ? requestInfo.body.value : undefined
    };

    return this.http(request)
      .catch(reportConnectionError(request))
      .then(verifyStatusCode(expectedResponse.status, request))
      .then(verifyBodyMatches(expectedResponse.body, request));
  }));
};

module.exports = Verifier;