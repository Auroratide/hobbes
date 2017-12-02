const nock = require('nock');
const { validateParam } = require('../utils/helpers');
const { requestSchema, responseSchema } = require('./contract.schema');

module.exports.withoutInterceptors = interactions => 
  Object.keys(interactions).reduce((i, key) => {
    i[key] = {
      request: interactions[key].request,
      response: interactions[key].response
    };

    return i;
  }, {});

module.exports.stubHttpRequest = (port, req = {}, res = {}) => {
  validateParam(req, requestSchema);
  validateParam(res, responseSchema);

  return nock(`http://localhost:${port}`)
    .intercept(req.path, req.method, req.body ? req.body.value : undefined)
    .reply(res.status, res.body ? res.body.value : undefined);
};
