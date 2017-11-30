function StatusVerificationError(expectedStatus, actualStatus, responseBody) {
  this.name = 'StatusVerificationError';

  let message = 'Response status does not match expected status:\n\n';
  message += `EXPECTED: ${expectedStatus}\n`;
  message += `ACTUAL  : ${actualStatus}\n\n`;
  message += 'Response body was:\n\n';
  message += JSON.stringify(responseBody, null, 2);

  this.message = message;
};

module.exports = StatusVerificationError;