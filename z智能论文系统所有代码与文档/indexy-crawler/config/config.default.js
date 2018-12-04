'use strict';

module.exports = {

  sequelize: {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: 'indexy',
    host: '139.129.20.182',
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
      return 'node-stream-indexy-engine' + Date.now();
    })(),
    opts: {
      url: 'nats://114.67.159.3:4222',
      maxReconnectAttempts: -1, // 一直重试
      reconnectTimeWait: 1000, // 1s
    },
    articlesCrawler: {
      subscript: {
        subject: 'indexy.articles',
        queueGroup: 'crawler.workers',

        // 订阅时可配置的参数
        subscriptionOptions: {
          durableName: 'crawler-workers',
          deliverAllAvailable: true,
          maxInFlight: 5, // 一次只接收处理5个消息
          ackWait: 60 * 10 * 1000, // 服务器等待消费者返回ack的时间,到达时间后不返回ack，服务器会重发msg,消费任务耗时长时可设置大一点
          manualAckMode: true, // 手动ack
        },
      },
    },
    //发布doi码的队列设置
    pdfCrawler: {
      publish: {
        subject: 'indexy.articlesDoi',
      }
    }
  },
};
