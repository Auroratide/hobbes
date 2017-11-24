const joi = require('joi');
const Types = require('../constants/types');

function Schema(validator) {
  this.validator = validator;
}

Schema.prototype.matches = function(value) {
  return joi.validate(value, this.validator).error === null;
};

Schema.create = function(toMatch) {
  let validator;

  switch(toMatch.type) {
    case Types.EXACT: {
      validator = joi.any().valid(toMatch.value);
      break;
    } case Types.STRING: {
      validator = joi.string();
      break;
    } case Types.NUMBER: {
      validator = joi.number();
      break;
    } case Types.BOOLEAN: {
      validator = joi.boolean();
      break;
    } case Types.OBJECT: {
      validator = joi.object().keys(Object.keys(toMatch.fields).reduce((val, key) => {
        val[key] = Schema.create(toMatch.fields[key]).validator;
        return val;
      }, {})).unknown();
      break;
    } default: {
      validator = joi.any();
      break;
    }
  }

  return new Schema(validator);
};

module.exports = Schema;