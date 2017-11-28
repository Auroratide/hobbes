const joi = require('joi');
const Types = require('../constants/types');

function Schema(validator) {
  this.validator = validator;
}

Schema.prototype.matches = function(value) {
  return joi.validate(value, this.validator, { convert: false }).error === null;
};

Schema.create = function(toMatch) {
  let validator;

  switch(toMatch.type) {
    case Types.EXACT: {
      validator = joi.any().valid(toMatch.value).required();
      break;
    } case Types.STRING: {
      validator = joi.string().required();
      break;
    } case Types.NUMBER: {
      validator = joi.number().required();
      break;
    } case Types.BOOLEAN: {
      validator = joi.boolean().required();
      break;
    } case Types.OBJECT: {
      validator = joi.object().keys(Object.keys(toMatch.fields).reduce((val, key) => {
        val[key] = Schema.create(toMatch.fields[key]).validator;
        return val;
      }, {})).unknown();
      break;
    } case Types.ARRAY: {
      validator = joi.array().items(Schema.create(toMatch.of).validator);
      break;
    } default: {
      validator = joi.any().forbidden();
      break;
    }
  }

  return new Schema(validator);
};

module.exports = Schema;