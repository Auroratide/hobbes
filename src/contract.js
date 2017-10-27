const nock = require('nock');

function Contract(options = {}) {
  this.consumer = options.consumer;
  this.provider = options.provider;
  this.port = options.port;
  this.interactions = [];
}

Contract.prototype.interaction = function(options) {
  nock(`http://localhost:${this.port.toString()}`)
    .intercept(options.request.path, options.request.method)
    .reply(options.response.status, options.response.body);
  
};

module.exports = Contract;