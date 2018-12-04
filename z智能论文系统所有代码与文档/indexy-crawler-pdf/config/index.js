'use strict';

let env = process.env.NODE_ENV || 'default';
env = env.toLowerCase();

console.log('默认环境：%s', env);

module.exports = require(`./config.${env}.js`);
