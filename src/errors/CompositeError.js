module.exports = function CompositeError(errors) {
  this.name = 'CompositeError';
  this.errors = errors;

  let message = `${errors.length} ERRORS OCCURRED:`;
  errors.forEach(error => {
    message += '\n\n=======================================================\n\n';
    message += error.message;
  });

  this.message = message;
};
