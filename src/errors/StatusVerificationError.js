module.exports = function StatusVerificationError(expectedStatus, actualStatus, responseBody, originalRequest) {
  this.name = 'StatusVerificationError';

  let message = `VERIFICATION ERROR: ${originalRequest.method} ${originalRequest.url}\n`;
  message += 'Response status does not match expected status:\n\n';
  message += `EXPECTED: ${expectedStatus}\n`;
  message += `ACTUAL  : ${actualStatus}\n\n`;
  message += 'Response body was:\n\n';
  message += JSON.stringify(responseBody, null, 2);

  if(originalRequest.data) {
    message += '\n\n-----------------------------------------------------\n\n';
    message += 'This was the request body:\n\n';
    message += JSON.stringify(originalRequest.data, null, 2);
  }

  this.message = message;
};