const joi = require('joi');
const Methods = require('../constants/methods');

module.exports.requestSchema = joi.object().keys({
  path: joi.string().required(),
  method: joi.any().valid(Methods.all()).required(),
  body: joi.object().keys({
    value: joi.any().required()
  }).unknown()
}).unknown();

module.exports.responseSchema = joi.object().keys({
  status: joi.number().required(),
  body: joi.object().keys({
    value: joi.any().required()
  }).unknown()
}).unknown();

module.exports.interactionSchema = joi.object().keys({
  request: joi.object().keys({
    path: joi.string().required(),
    method: joi.any().valid(Methods.all()).required()
  }).unknown().required(),
  response: joi.object().unknown().required()
}).unknown();
