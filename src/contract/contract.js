const path = require('path');
const nock = require('nock');
const fs = require('../utils/fs');

const withoutInterceptors = interactions => Object.keys(interactions).reduce((i, key) => {
  i[key] = {
    request: interactions[key].request,
    response: interactions[key].response
  };

  return i;
}, {});

function Contract(options = {}) {
  this.consumer = options.consumer;
  this.provider = options.provider;
  this.port = options.port;
  this.directory = options.directory;

  this.interactions = {};
}

Contract.prototype.interaction = function(options) {
  const interceptor = nock(`http://localhost:${this.port.toString()}`)
    .intercept(options.request.path, options.request.method)
    .reply(options.response.status, options.response.body.value);

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

  return fs.writeJson(path.resolve(this.directory, `${this.consumer}-${this.provider}.json`), {
    consumer: this.consumer,
    provider: this.provider,
    interactions: withoutInterceptors(this.interactions)
  });
};

module.exports = Contract;