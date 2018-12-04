'use strict';

const path = require('path');

module.exports = {

  sequelize: {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: 'indexy',
    host: process.env.MYSQL_HOST || '139.129.20.182',
    port: '3306',
    username: 'root',
    password: 'indexy_mysql_v1',
    pool: {
      max: 8, // 最大连接数
      min: 0, // 最小连接数
      idle: 10000, // connection释放前的最大空闲时间
    },
    timezone: '+08:00',
  },

  nats: {
    clusterId: 'test-cluster',//集群id必须与nats-server一致
    clientId: (() => {
      return 'indexy-crawler-pdf_' + Date.now();
    })(),
    opts: {
      url: process.env.NATS_URL || 'nats://114.67.159.3:4222',
      maxReconnectAttempts: -1, // 一直重试
      reconnectTimeWait: 1000, // 1s
    },
    //发布doi码的队列设置
    pdfCrawler: {
      subscript: {
        subject: 'indexy.articlesDoi',
        queueGroup: 'crawler.workers',
        // 订阅时可配置的参数
        subscriptionOptions: {
          durableName: 'crawler-workers',
          deliverAllAvailable: true,
          maxInFlight: 1, // 一次只接收处理1个消息, ps:由于共用同一个driver,因此这里必须设置为1
          ackWait: 60 * 5 * 1000, // 服务器等待消费者返回ack的时间,到达时间后不返回ack，服务器会重发msg,消费任务耗时长时可设置大一点
          manualAckMode: true, // 手动ack
        },
      },
    }
  },
  selenium: {
    options: {
      SELENIUM_BROWSER_NAME: 'firefox',
      FIREFOX_OPTIONS: {
        'prefes': {
          'browser.download.dir': path.resolve('indexy-pdf'), //下载文件存放目录
        },
        'remoteServer': process.env.FIREFOX_REMOUTE_SERVER || 'http://127.0.0.1:4444//wd/hub', //firefox远程连接地址,可以是局域网ip,公网暂时不行
      }

    }
  }

};
