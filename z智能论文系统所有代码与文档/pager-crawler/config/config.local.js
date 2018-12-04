'use strict';

module.exports = () => {

  return {

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
    },

    logger: {
      level: 'DEBUG',
      consoleLevel: 'DEBUG',
    },

    nats: {
      subject: 'indexy.articles',
      clusterId: 'test-cluster',
      clientId: (() => {
        return 'node-stream-pub_' + (process.env.nats_cid || '');
      })(),
      opts: {
        url: 'nats://localhost:4223',
        maxReconnectAttempts: -1, // 一直重试
        reconnectTimeWait: 1000, // 1s
      },
    },

  };

};
