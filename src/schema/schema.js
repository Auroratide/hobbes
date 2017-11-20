const joi = require('joi');

function Schema(validator) {
  this.validator = validator;
}

Schema.prototype.matches = function(value) {
  return joi.validate(value, this.validator).error === null;
};

Schema.create = function(toMatch) {
  let validator;
  const hobbesMatcher = toMatch.__hobbes__;

  if(hobbesMatcher) {
    validator = joi.string();
  } else if(typeof toMatch === 'object') {
    validator = joi.object().keys(Object.keys(toMatch).reduce((currentObj, key) => {
      currentObj[key] = Schema.create(toMatch[key]).validator;
      return currentObj;
    }, {}))
  } else {
    validator = joi.any().valid(toMatch);
  }

  return new Schema(validator);
};

module.exports = Schema;