'use-strict';

/**
 * 使用redis实现文章增量爬虫
 */
const redis = require("redis");
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);

class ScraperFilter {

  constructor(redisOptions) {
    this.client = redis.createClient(redisOptions);
    this.key = 'article_url';
  }

  async insertRedis(value) {
    await this.client.zaddAsync(this.key, 1, value);
    console.log('added ' + value + ' items into redis');
  }

  async existValue(value) {
    const d1 = await client.zrankAsync(this.key, value)
    return (d1 && d1 >= 0 ? true : false);
  }

}

const redisOptions = {
  host: '139.129.20.182',
  port: 6379,
  password: 'indexy_crawler',
}
const scraperFilter=new ScraperFilter(redisOptions);

scraperFilter.insertRedis('one');




