const {
  reportConnectionError,
  verifyStatusCode,
  verifyBodyMatches
} = require('./verifier.helpers');
const { contractSchema } = require('./verifier.schema');
const { validateParam } = require('../utils/helpers');
const CompositeError = require('../errors/CompositeError');

const Verifier = function(http) {
  this.http = http;
};

Verifier.prototype.verify = function(contract) {
  validateParam(contract, contractSchema);

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
      .then(verifyBodyMatches(expectedResponse.body, request))
      .catch(error => {
        return {
          isError: true,
          error
        };
      });
  })).then(results => {
    const errors = results.filter(result => result.isError);
    if(errors.length > 0)
      throw new CompositeError(errors.map(e => e.error));
  });
};

module.exports = Verifier;