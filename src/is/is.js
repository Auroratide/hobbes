const Types = require('../constants/types');

const createBasicMatcher = (type) => (value) => { 
  return {
    value,
    type
  };
};

const is = createBasicMatcher(Types.EXACT);
is.string = createBasicMatcher(Types.STRING);
is.number = createBasicMatcher(Types.NUMBER);
is.boolean = createBasicMatcher(Types.BOOLEAN);

is.object = (fields) => {
  return {
    type: Types.OBJECT,
    fields,
    value: Object.keys(fields).reduce((val, key) => {
      val[key] = fields[key].value;
      return val;
    }, {})
  };
};

is.arrayOf = (of) => {
  return {
    type: Types.ARRAY,
    of,
    value: [ of.value ]
  };
};

module.exports = is;