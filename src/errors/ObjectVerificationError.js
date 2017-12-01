const createErrorMessage = (errors, originalObject, originalRequest) => {
  let message = `VERIFICATION ERROR: ${originalRequest.method} ${originalRequest.url}\n`;
  message += 'Object did not pass verification.  See below for details:\n\n';

  errors.forEach((error, index) => {
    const num = `${index + 1}) `;
    message += `${index + 1}) ${error.message}\n`;
    message += ' '.repeat(num.length) + `Path: ${error.path.join('.')}\n\n`;
  });

  message += '-----------------------------------------------------\n\n';
  message += 'The following object was received:\n\n';
  message += JSON.stringify(originalObject, null, 2);

  if(originalRequest.data) {
    message += '\n\n-----------------------------------------------------\n\n';
    message += 'This was the request body:\n\n';
    message += JSON.stringify(originalRequest.data, null, 2);
  }

  return message;
};

function ObjectVerificationError(errors, originalObject, originalRequest) {
  this.name = 'ObjectVerificationError';
  this.errors = errors;
  this.object = originalObject;

  this.message = createErrorMessage(errors, originalObject, originalRequest);
}

module.exports = ObjectVerificationError;