const Types = require('../constants/types');

const createBasicMatcher = (type) => (value) => { return {
  __hobbes__: {
    value,
    type
  }
} };

const string = createBasicMatcher(Types.STRING);
const number = createBasicMatcher(Types.NUMBER);
const boolean = createBasicMatcher(Types.BOOLEAN);

const valueFor = (arrayElement) => {
  if(arrayElement.__hobbes__) {
    return arrayElement.__hobbes__.value;
  } else if(typeof arrayElement === 'object') {
    return Object.keys(arrayElement).reduce((curObj, key) => {
      curObj[key] = valueFor(arrayElement[key]);
      return curObj;
    }, {});
  } else {
    return arrayElement;
  }
};

const arrayOf = (element) => { return {
  __hobbes__: {
    value: [ valueFor(element) ],
    type: Types.ARRAY
  }
} };

module.exports = {
  string,
  number,
  boolean,
  arrayOf
};