function ConnectionRefusedError(url) {
  this.name = 'ConnectionRefusedError';
  this.message = `Could not connect to ${url}`;
};

module.exports = ConnectionRefusedError;