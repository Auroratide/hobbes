const axios = require('axios');
const fs = require('./utils/fs');
const Contract = require('./contract');
const Verifier = require('./verifier');

const contract = options => new Contract(options);

const sameTypeAs = value => { return {
  __hobbes_matcher__: {
    value
  }
} };

const verify = options => {
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
  sameTypeAs
};
