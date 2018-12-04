'use strict';

const cluster_id = 'test.js-cluster';
const client_id = 'node-stan-sub';
const server = 'nats://114.67.159.3:4222';

const stan = require('node-nats-streaming').connect(cluster_id, client_id, server);

stan.on('connect', function() {

  const opts = stan.subscriptionOptions();
  // 只消费 持久名称 my-durable，客户端还未ack过的消息；增量式消费
  opts.setDurableName('my-durable');
  opts.setDeliverAllAvailable();

  // 消费者并发性在服务器设置
  opts.setMaxInFlight(3); // 消费者内部阻塞上限，消费者队列
  opts.setManualAckMode(true); // 手动ack模式
  // opts.setAckWait(60*1000);

  const durableSub = stan.subscribe('foo', {
    qGroup: 'queue.worker',
  }, opts);

  durableSub.on('message', async function(msg) {
    console.log('Received a message: ' + msg.getData());
    await sleep(10000);
    console.log('完成一次消费: ' + msg.getData());

    msg.ack();
  });

});


// 模拟异步请求
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// Subscriber can specify how many existing messages to get.
// var opts = stan.subscriptionOptions().setStartWithLastReceived();
// var subscription = stan.subscribe('foo', opts);
// subscription.on('message', function (msg) {
//   console.log('Received a message [' + msg.getSequence() + '] ' + msg.getData());
// });
//
// stan.on('close', function () {
//   process.exit();
// });// durableSub.close();
//
// stan.on('error', function (err) {
//   console.log(err)
// });
