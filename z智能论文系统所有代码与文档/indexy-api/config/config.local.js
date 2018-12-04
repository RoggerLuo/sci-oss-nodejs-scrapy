'use strict';

module.exports = () => {

  return {

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

    logger: {
      level: 'DEBUG',
      consoleLevel: 'DEBUG',
    },
    nats: {
      subject: 'indexy.articlesDoi',
      clusterId: 'test-cluster',
      clientId: (() => {
        return 'node-stream-indexy-api_' + (process.env.nats_cid || Date.now());
      })(),
      opts: {
        url: 'nats://114.67.159.3:4222',
        maxReconnectAttempts: -1, // 一直重试
        reconnectTimeWait: 1000, // 1s
      },
    },


  };

};
