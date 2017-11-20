const createMatcher = (type) => (value) => { return {
  __hobbes__: {
    value,
    type
  }
} };

const string = createMatcher('string');

const number = createMatcher('number');

module.exports = {
  string,
  number
};