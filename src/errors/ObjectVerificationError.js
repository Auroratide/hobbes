const createErrorMessage = (errors, originalObject) => {
  let message = 'Object did not pass verification.  See below for details:\n\n';

  errors.forEach((error, index) => {
    const num = `${index + 1}) `;
    message += `${index + 1}) ${error.message}\n`;
    message += ' '.repeat(num.length) + `Path: ${error.path.join('.')}\n\n`;
  });

  message += '\nThe following object was received:\n\n';
  message += JSON.stringify(originalObject, null, 2);

  return message;
};

function ObjectVerificationError(errors, originalObject) {
  this.name = 'ObjectVerificationError';
  this.errors = errors;
  this.object = originalObject;

  this.message = createErrorMessage(errors, originalObject);
}

module.exports = ObjectVerificationError;