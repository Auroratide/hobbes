const joi = require('joi');
const Types = require('../constants/types');

const exact = (value) =>
  joi.any().valid(value).required();

const string = () =>
  joi.string().required();

const number = () =>
  joi.number().required();

const boolean = () =>
  joi.boolean().required();

const object = (fields) =>
  joi.object().keys(Object.keys(fields).reduce((val, key) => {
    val[key] = create(fields[key]);
    return val;
  }, {})).unknown();

const array = (obj) =>
  joi.array().items(create(obj)).min(1);

const forbidden = () =>
  joi.any().forbidden();

const create = (matcher) => {
  switch(matcher.type) {
    case Types.EXACT: 
      return exact(matcher.value);
    case Types.STRING:
      return string();
    case Types.NUMBER:
      return number();
    case Types.BOOLEAN:
      return boolean();
    case Types.OBJECT:
      return object(matcher.fields);
    case Types.ARRAY:
      return array(matcher.of);
    default:
      return forbidden();
  }
};

module.exports = create;