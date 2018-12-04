"use-strict";


var cluster_id = "test-cluster";
var client_id = "node-stream-indexy-engine-pdf-client-1";
var server = 'nats://114.67.159.3:4222';
const PdfScraper = require('../scraper/pdfScraper');

var stan = require('node-nats-streaming').connect(cluster_id, client_id, server);

stan.on('connect', function () {

  var opts = stan.subscriptionOptions();
  // 只消费 持久名称 my-durable，客户端还未ack过的消息；增量式消费
  opts.setDurableName('my-durable');
  opts.setDeliverAllAvailable();

  // 消费者并发性在服务器设置
  opts.setMaxInFlight(1); // 消费者内部阻塞上限，消费者队列
  opts.setManualAckMode(true); // 手动ack模式
  opts.setAckWait(60 * 1000 * 5);//服务器等待消费者返回ack的时间,到达时间后不返回ack，服务器会重发msg,消费msg的任务耗时长时可设置大一点

  var durableSub = stan.subscribe('indexy.articlesDoi', 'crawler.workers', opts);

  durableSub.on('message', async function (msg) {
    console.log('Received a message: ' + msg.getData());

    const data = JSON.parse(msg.getData());
    try {
      //开始爬取pdf全文 TODO 测试
      await PdfScraper.beginScraperPdf(data.id, data.doiCode);

      console.log('完成一次消费: ' + msg.getData());

    } catch (err) {
      console.log('没有成功爬取pdf: ' + err.message);
    } finally {
      //不管成功还是失败，避免消息队列重发消息，从而重新爬取pdf
      console.log("ack send!")
      msg.ack();
    }
  });

})


//模拟异步请求
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
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
