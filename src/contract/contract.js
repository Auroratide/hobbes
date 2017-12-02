const path = require('path');
const fs = require('../utils/fs');
const {
  withoutInterceptors,
  stubHttpRequest
} = require('./contract.helpers');
const { validateParam } = require('../utils/helpers');
const { interactionSchema } = require('./contract.schema');

const Contract = function(options = {}) {
  this.consumer = options.consumer;
  this.provider = options.provider;
  this.port = options.port;
  this.directory = options.directory;

  this.interactions = {};
};

Contract.prototype.interaction = function(options) {
  validateParam(options, interactionSchema);

  const interceptor = stubHttpRequest(this.port, options.request, options.response);

  const interaction = {
    request: options.request,
    response: options.response,
    interceptor
  };
  
  this.interactions[`${options.request.method} ${options.request.path}`] = interaction;
};

Contract.prototype.finalize = function() {
  Object.keys(this.interactions).forEach(key => {
    const interaction = this.interactions[key];
    if(!interaction.interceptor.isDone())
      throw new Error('FAILURE');
  });

  return fs.writeJson(path.resolve(this.directory, `${this.consumer}-${this.provider}.json`), {
    consumer: this.consumer,
    provider: this.provider,
    interactions: withoutInterceptors(this.interactions)
  });
};

module.exports = Contract;