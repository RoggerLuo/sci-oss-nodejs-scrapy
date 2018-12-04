'use strict';

const zbus = require('zbus');

const Broker = zbus.Broker;

const Consumer = zbus.Consumer;

const broker = new Broker('localhost:15555');

const c = new Consumer(broker, { topic: 'MyTopic', consume_group: 'group1' });
c.messageHandler = async function(msg, client) {
  // handle the business
  console.log(msg);
  await sleep(10000);
  console.log('完成一次消费');
  console.log(client);
};
// 模拟异步请求
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


c.start();
