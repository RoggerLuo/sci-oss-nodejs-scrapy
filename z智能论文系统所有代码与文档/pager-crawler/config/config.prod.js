'use strict';

module.exports = () => {

  return {

    middleware: [ 'errorHandler' ], // 本地开发接口时，默认的错误处理，浏览器打开比较友好

    sequelize: {
      dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
      database: 'indexy',
      host: 'localhost',
      port: '3306',
      username: 'root',
      password: 'indexy_mysql_v1',
      pool: {
        max: 8, // 最大连接数
        min: 0, // 最小连接数
        idle: 10000, // connection释放前的最大空闲时间
      },
      timezone: '+08:00',
      logging: false,
    },

    nats: {
      subject: 'indexy.articles',
      clusterId: 'test-cluster',
      clientId: (() => {
        return 'node-stream-pub_' + Date.now(); // ( process.env.nats_cid || '' )
      })(),
      opts: {
        url: 'nats://localhost:4223',
        maxReconnectAttempts: -1, // 一直重试
        reconnectTimeWait: 1000, // 1s
      },
      // 订阅时可配置的参数
      subscriptionOptions: {
        durableName: 'crawler-workers',
        deliverAllAvailable: true,
        maxInFlight: 5, // 一次只接收处理5个消息
        // ackWait: 60 * 1000,
        manualAckMode: true, // 手动ack
      },
    },

    logger: {
      level: 'INFO',
      consoleLevel: 'INFO',
    },
  };

};
