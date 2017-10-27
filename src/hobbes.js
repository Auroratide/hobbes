const Contract = require('./contract');

const contract = options => new Contract(options);

module.exports = {
  contract
};

/*
hobbes.contract({
  consumer: '',
  provider: '',
  port: 0
});

contract.interaction({
  name: '',
  request: {
    method: 'GET',
    path: ''
  },
  response: {
    status: 200,
    body: {
      field: hobbes.like('string'),
      arr: hobbes.eachLike({

      })
    }
  }
});

contract.finalize(); // fails if not all interactions occurred...

hobbes.verify('url', file);


hobbes:
  contract
  like
  eachLike
  verify

contract:
  interaction
  finalize
*/