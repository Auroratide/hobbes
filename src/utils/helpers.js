module.exports.validateParam = (param, schema) => {
  const result = schema.validate(param);
  if(result.error)
    throw result.error;
};
