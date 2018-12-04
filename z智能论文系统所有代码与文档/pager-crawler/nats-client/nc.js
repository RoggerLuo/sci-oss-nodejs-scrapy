'use strict';


module.exports = app => {

  const config = require(`../config/config.${app.config.env}.js`)();

  const stan = require('node-nats-streaming').connect(config.nats.clusterId, config.nats.clientId, config.nats.opts);

  stan.on('error', e => {
    console.log('Error [' + stan.options.url + ']: ' + e);
  });

  stan.once('connect', _stan => {
    console.info('has connect success!');
    app.nc = _stan; // 挂载app属性
  });

  stan.once('close', () => {
    console.log('stan client closed');
  });

  stan.on('disconnect', () => {
    console.log('stan client disconnect');
  });

  stan.once('reconnecting', () => {
    console.log('stan client reconnecting...');
  });

  stan.on('reconnect', () => {
    console.log('stan client reconnect');
  });

  return stan;
};
