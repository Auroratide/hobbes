const joi = require('joi');

module.exports.contractOptionsSchema = joi.object().keys({
  consumer: joi.string().required(),
  provider: joi.string().required(),
  port: joi.number().required(),
  directory: joi.string().required()
}).unknown();

module.exports.verifyOptionsSchema = joi.object().keys({
  baseURL: joi.string().required(),
  contract: joi.string().required()
}).unknown();
