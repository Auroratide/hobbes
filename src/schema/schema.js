const joi = require('joi');
const createValidator = require('./validator-factory');

const Schema = function(validator) {
  this.validator = validator;
  this._errors = null;
};

Schema.prototype.matches = function(value) {
  this._errors = joi.validate(value, this.validator, {
    convert: false,
    abortEarly: false
  }).error;

  return this._errors === null;
};

Schema.prototype.errors = function() {
  return this._errors;
};

Schema.create = function(toMatch) {
  return new Schema(createValidator(toMatch));
};

module.exports = Schema;