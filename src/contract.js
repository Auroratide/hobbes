const nock = require('nock');

function Contract(options = {}) {
  this.consumer = options.consumer;
  this.provider = options.provider;
  this.port = options.port;
  this.interactions = {};
}

Contract.prototype.interaction = function(options) {
  const interceptor = nock(`http://localhost:${this.port.toString()}`)
    .intercept(options.request.path, options.request.method)
    .reply(options.response.status, options.response.body);

  const interaction = {
    request: options.request,
    response: options.response,
    interceptor: interceptor
  };
  
  this.interactions[`${options.request.method} ${options.request.path}`] = interaction;
};

Contract.prototype.finalize = function() {
  Object.keys(this.interactions).forEach(key => {
    const interaction = this.interactions[key];
    if(!interaction.interceptor.isDone())
      throw new Error('FAILURE');
  });
};

module.exports = Contract;