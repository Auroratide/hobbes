const joi = require('joi');
const Methods = require('../constants/methods');

module.exports.contractSchema = joi.object().keys({
  consumer: joi.string(),
  provider: joi.string(),
  interactions: joi.object().pattern(/.+/, joi.object().keys({
    request: joi.object().keys({
      path: joi.string().required(),
      method: joi.any().valid(Methods.all()).required(),
      body: joi.object().keys({
        value: joi.any().required()
      }).unknown()
    }).unknown().required(),
    response: joi.object().keys({
      status: joi.number().required()
    }).unknown().required()
  }).unknown()).unknown().required()
}).unknown();
