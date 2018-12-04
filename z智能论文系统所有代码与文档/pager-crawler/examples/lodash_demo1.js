const _ = require('lodash');

const obj = {
  a: 1,
  b: '111',
  c: undefined,
};

const obj2 = _.toPlainObject(obj);
const obj3 = _.toPairsIn(obj2);

console.log(JSON.stringify(obj3));
