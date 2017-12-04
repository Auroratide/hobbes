const axios = require('axios');
const fs = require('./utils/fs');
const Contract = require('./contract');
const Verifier = require('./verifier');
const is = require('./is');
const { validateParam } = require('./utils/helpers');
const {
  contractOptionsSchema,
  verifyOptionsSchema
} = require('./hobbes.schema');

const contract = options => {
  validateParam(options, contractOptionsSchema);
  return new Contract(options);
};

const verify = options => {
  validateParam(options, verifyOptionsSchema);
  
  return fs.readJson(options.contract).then(data => {
    const http = axios.create({
      baseURL: options.baseURL
    });

    return new Verifier(http).verify(data);
  });
};

module.exports = {
  contract,
  verify,
  is
};
