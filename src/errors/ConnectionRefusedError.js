module.exports = function ConnectionRefusedError(url, originalRequest) {
  this.name = 'ConnectionRefusedError';

  let message = `CONNECTION ERROR: ${originalRequest.method} ${originalRequest.url}\n`;
  message += `Could not connect to ${url}`;

  this.message = message;
};
