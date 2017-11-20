const Types = require('../constants/types');

const createMatcher = (type) => (value) => { return {
  __hobbes__: {
    value,
    type
  }
} };

const string = createMatcher(Types.STRING);
const number = createMatcher(Types.NUMBER);
const boolean = createMatcher(Types.BOOLEAN);

module.exports = {
  string,
  number,
  boolean
};