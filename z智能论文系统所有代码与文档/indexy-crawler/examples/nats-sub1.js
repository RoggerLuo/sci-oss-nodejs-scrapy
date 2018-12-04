'use-strict';

/**
 * 与nat-sub.js同时运行，测试当更改了客户端id,同一个队列组的已消费的数据是否会重新消费
 * 测试步骤：
 * (1)运行nat-sub.js启动订阅者1
 * (2)运行nat-pub.js启动发布者发布msg
 * (3)查看订阅者1消费的msg，当全部msg消费完成后启动nat-sub1.js启动订阅者2(不同client_id)
 * (4)若没有收到msg,说明同一个队列组的已消费的数据不会重新消费
 * @type {string}
 */

const cluster_id = 'test-cluster';
const client_id = 'node-stan-sub1';
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
  opts.setAckWait(60 * 1000);// 服务器等待消费者返回ack的时间,到达时间后不返回ack，服务器会重发msg,消费msg的任务耗时长时可设置大一点

  const durableSub = stan.subscribe('foo', 'queue.worker', opts);

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
