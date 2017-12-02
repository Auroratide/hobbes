const Schema = require('../schema');

const {
  StatusVerificationError,
  ObjectVerificationError,
  ConnectionRefusedError
} = require('../errors');

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

    return this.http(request).catch(err => {
      if(err.code === 'ECONNREFUSED')
        throw new ConnectionRefusedError(err.config.url, request);
      else
        return err.response;
    }).then(res => {
      if(res.status !== expectedResponse.status) {
        throw new StatusVerificationError(expectedResponse.status, res.status, res.data, request);
      }

      const schema = Schema.create(expectedResponse.body);

      if(!schema.matches(res.data)) {
        throw new ObjectVerificationError(schema.errors().details, schema.errors()._object, request);
      }
    });
  }));
};

module.exports = Verifier;