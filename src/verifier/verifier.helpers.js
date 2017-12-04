const Schema = require('../schema');
const {
  StatusVerificationError,
  ObjectVerificationError,
  ConnectionRefusedError
} = require('../errors');
const ErrorCodes = require('../constants/error-codes');

module.exports.reportConnectionError = request => err => {
  if(err.code === ErrorCodes.CONNECTION_REFUSED)
    throw new ConnectionRefusedError(err.config.url, request);
  else
    return err.response;
};

module.exports.verifyStatusCode = (expectedStatus, request) => response => {
  if(response.status !== expectedStatus) {
    throw new StatusVerificationError(expectedStatus, response.status, response.data, request);
  } else {
    return response;
  }
};

module.exports.verifyBodyMatches = (expectedBody, request) => response => {
  const schema = Schema.create(expectedBody);
  
  if(!schema.matches(response.data)) {
    throw new ObjectVerificationError(schema.errors().details, schema.errors()._object, request);
  } else {
    return response;
  }
};
