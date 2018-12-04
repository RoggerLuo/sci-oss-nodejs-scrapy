'use strict';

const config = require('../config'),
  nc = require('../nats-client/nc.js'),
  PdfScraper = require('../scraper/pdfFirfoxScraper');


// connect to mysql
require('./model/sequelize-db');

nc.on('connect', async _nats_stream => {
  console.log('nats_stream client[indexy-crawler-pdf] connected');
  console.log('nc === _nats_stream：%s', _nats_stream === nc);

  /***
   * 爬取pdf全文
   */
  await sleep(5000);//防止firefox浏览器还没打开就开始爬取了
  const {subject: pdfSubject, queueGroup: pdfQueueGroup} = config.nats.pdfCrawler.subscript;
  const {
    durableName: pdfDurableName, deliverAllAvailable: pdfDeliverAllAvailable,
    maxInFlight: pdfMaxInFlight, ackWait: pdfAckWait, manualAckMode: pdfManualAckMode
  } = config.nats.pdfCrawler.subscript.subscriptionOptions;

  const pdfOpts = nc.subscriptionOptions();
  pdfOpts.setDurableName(pdfDurableName);
  if (pdfDeliverAllAvailable) pdfOpts.setDeliverAllAvailable();

  // 消费者并发性在服务器设置
  pdfOpts.setMaxInFlight(pdfMaxInFlight); // 消费者内部阻塞上限，消费者队列
  pdfOpts.setManualAckMode(pdfManualAckMode); // 手动ack模式
  pdfOpts.setAckWait(pdfAckWait);//服务器等待消费者返回ack的时间,到达时间后不返回ack，服务器会重发msg,消费msg的任务耗时长时可设置大一点
  const durableSub1 = nc.subscribe(pdfSubject, pdfQueueGroup, pdfOpts);
  durableSub1.on('message', async msg => {
    console.log('Received a message from articlesDoi: ' + msg.getData());

    //停顿一段时间,防止频繁访问被网站检测到是程序所为
    sleep(Math.random() * 5000);//5s以内

    //开始爬取pdf全文
    let filePath = null;
    const data = JSON.parse(msg.getData());
    try {
      //开始爬取pdf全文 TODO 测试
      console.log('开始爬取PDF ^_^');

      await PdfScraper.beginScraperPdf(data.id, data.doiCode);

      console.log('完成PDF爬取: ' + msg.getData());

    } catch (err) {
      console.log('没有成功爬取pdf: ' + err.message);
    } finally {
      //不管成功还是失败，避免消息队列重发消息，从而重新爬取pdf
      console.log("ack send!")
      msg.ack();
    }
  })
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

