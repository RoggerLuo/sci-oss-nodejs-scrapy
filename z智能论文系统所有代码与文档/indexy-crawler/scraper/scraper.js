'use strict';
const scraperjs = require('scraperjs');
const scrapeIt = require('scrape-it');
const pRetry = require('p-retry');
const asyncm = require('async');
const articleSerivce = require('../lib/service/article');
const authorSerivce = require('../lib/service/author');
const nc = require('../nats-client/nc.js');
const config = require('../config')

const taskResult = require('../lib/service/taskResult');
const _ = require('lodash');

const BULK_LIMIT = 20;
const SCRAPED_FLAG = 2;
const SAVED_FLAG = 1;

const {EventEmitter} = require('events');


class Scraper extends EventEmitter {

  // 爬取网页并返回$
  _get$(url, flowConfig = {}, isStatic = true) {

    // 重试和延迟机制
    try {
      flowConfig.retries = flowConfig.retries || 0;
      flowConfig.timeout = flowConfig.timeout || 5000;

      return pRetry(run, flowConfig);

    } catch (err) {
      throw err;
    }

    function run() {
      const promise = new Promise((resolve, reject) => {
        const scraperPromise = scraperjs[isStatic ? 'StaticScraper' : 'DynamicScraper'].create();
        scraperPromise.request({
          uri: url,
          method: 'GET',
          timeout: flowConfig.timeout,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko)' +
            ' Chrome/61.0.3163.100 Safari/537.36',
          },
          jar: true
        }).delay(flowConfig.delay || 0)
          .onStatusCode(404, () => {
            throw new pRetry.AbortError(`${url} : 404 not found`);
          })
          .scrape($ => {
            resolve($);
          })
          .catch(err => {
            console.error(`${url}：${err.message}`);
            reject(err);
          });
      });
      return promise;
    }

  }

  // 数据处理
  _handlerConfig(jsonConfig) {
    const _this = this;
    const configArray = [];
    jsonConfig.forEach(function (val, idx) {
      const target = val.target;
      delete val.target;
      const seletors = _this._convertFn(val);
      configArray.push([target, seletors]);
    });
    const config = {};
    config.content = configArray[configArray.length - 1];
    configArray.pop();
    config.catalog = configArray;
    return config;
  }

  // 多个爬取，主要考虑到需爬取的目标可能有多个,可设置延时，并行
  async _multipleCatalogScrape(config, urls = {}, flowConfig = {}, i = 1) {
    try {
      const targets = config[0] ? [config[0]] : this._getContentUrls(urls);
      flowConfig.concurrency = flowConfig.concurrency || 1;
      const promise = new Promise((resolve, reject) => {
        asyncm.eachLimit(targets, flowConfig.concurrency, async (target, done) => {
          if (config[0]) {
            urls = await this._scraperForCatalog([target, config[1], config[2]]);
          } else {
            let result = await this._scraperForCatalog([target, config[1], config[2]]);
            if (i < 3) urls[target] = result;
            else this._setValueByKey(urls, target, result);
          }
          done();
        }, err => {
          err ? reject(err) : resolve(urls);
        });
      });
      return promise;
    } catch (err) {
      console.error(err.message);
      return urls;
    }
  }

  // 爬取多个内容
  async _multipleContentScrape(content, targets, flowConfig = {}, taskResultId, journal, urls) {

    flowConfig.concurrency = flowConfig.concurrency || 1;
    let result = [];
    

    const promise = new Promise((resolve, reject) => {

      


      asyncm.eachLimit(targets, flowConfig.concurrency, async (target, done) => {
        

        const scraperContent = await this._scraperForContent([target, content[1]], flowConfig, taskResultId, journal);
        
        
        if (scraperContent) result.push(scraperContent);
        // 批量存储
        if (result.length >= BULK_LIMIT) {
          try {
            const tmpResult = result;
            result = [];
            await this._saveResult(tmpResult, urls);
          } catch (err) {
            console.error(err.message);
          }
        }
        done();
      }, async (err) => {
        if (err) {
          reject(err);
        } else {
          await this._saveResult(result, urls);
          resolve();
        }
      });
    });


    return promise;

  }

  // 爬取目录，若有翻页则递归爬取
  async _scraperForCatalog(config, flowConfig = {}) {
    let urls = {};
    try {
      const $ = await this._get$(config[0], flowConfig);
      const result = scrapeIt.scrapeHTML($, config[1]);
      result.items.forEach(function (val, idx) {
        urls[val.url] = SCRAPED_FLAG;
      });
      if (result.nextPage) {
        config[0] = result.nextPage;
        return Object.assign(urls, await this._scraperForCatalog(config, flowConfig));
      }
      return urls;

    } catch (err) {
      console.error(err.message);
      return urls;
    }
  }

  // 爬取内容
  async _scraperForContent(config, flowConfig = {}, taskResultId, journal) {
    try {
      const $ = await this._get$(config[0], flowConfig);
      const result = scrapeIt.scrapeHTML($, config[1]);
      result.sourceUrl = config[0];
      result.taskResult_id = taskResultId;
      result.journal = journal;
      return result;
    } catch (err) {
      console.error(err.message);
      return null;
    }

  }

  // 转换convert成可执行函数
  _convertFn(obj, key = 'convert') {
    for (const k in obj) {
      if (k === key) {
        obj[k] = eval(obj[k]);
      } else if (typeof obj[k] === 'object') {
        this._convertFn(obj[k], key);
      }
    }
    return obj;
  }

  // 爬取目录后获取文章的地址列表
  _getContentUrls(obj, val = SCRAPED_FLAG) {
    let urls = [];
    for (const k in obj) {
      if (obj[k] === val) {
        urls.push(k);
      } else {
        urls = urls.concat(this._getContentUrls(obj[k], val));
      }
    }
    return urls;
  }

  //获取爬取进度,不在targets里面的不进行计算
  _getScraperProgress(obj) {
    let progress = {
      total: 0,
      saved: 0
    };
    for (const k in obj) {
      /* obj是网址作为k,数字FLAG作为value的对象 */
      if (obj[k] === SAVED_FLAG) {
        progress.saved++;
        progress.total++;
      } else if (obj[k] === SCRAPED_FLAG) {
        progress.total++;
      } else {
        progress.saved += (this._getScraperProgress(obj[k])).saved;
        progress.total += (this._getScraperProgress(obj[k])).total;
      }
    }
    return progress;

  }

  //根据key查找值
  _setValueByKey(obj, key, val) {
    for (const k in obj) {
      if (k === key) obj[k] = val;
      else this._setValueByKey(obj[k], key, val);
    }
  }

  // 存储结果,并把文章的doi码放入队列中,爬取pdf全文 TODO 测试
  async _saveResult(result, urls) {
    console.log(`开始保存爬虫爬取结果`)

    try {
      if (result && result.length) {

        //数据格式处理
        for (let i = 0; i < result.length; i++) {
          result.author = result.author ? result.author.replace(/，|；/g, ',') : '';
        }
        result = await articleSerivce.bulkCreateArticles(result);
        
        //把文章的doi码放入队列中,爬取pdf
        let sourceUrls = [];
        for (let i = 0; i < result.length; i++) {
          if (result[i].doiCode) {
            nc.publish(config.nats.pdfCrawler.publish.subject, JSON.stringify({
                doiCode: result[i].doiCode,
                id: result[i].id
              }),
              (err, guid) => {
                console.log(`文章doiCode(${result[i].doiCode})收到 Ack: ${guid || err}`);
              });
          }
          sourceUrls.push(result[i].sourceUrl);
        }
        this._updateUrlState(urls, sourceUrls);

        //更新作者的文章量:eg {'张三':5}
        let countMap = {};
        result.forEach((r) => {
          r.author.split(',').forEach((author) => {
            if (!!author) countMap[author] = countMap[author] ? countMap[author] + 1 : 1;
          })
        })
        await authorSerivce.bulkUpdateArticleCount(countMap);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  //保存中间结构
  async _saveMiddles(urls = {}, taskResultId, progress) {
    try {
      urls = JSON.stringify(urls);
      await taskResult.updateTaskResultById(taskResultId, {middles: urls, progress: progress});
    } catch (err) {
      console.error(err.message);
    }
  }

  //更改url的状态，修改成SAVED_FLAG
  _updateUrlState(urls = {}, keys = []) {
    for (let k in urls) {
      if (keys.indexOf(k) >= 0) {
        urls[k] = SAVED_FLAG;
      }
      if (typeof urls[k] === 'object') this._updateUrlState(urls[k], keys);
    }
  }

  /**
   * 对数组按长度分组：主要用于in查询超过1000的情况
   * @param array
   * @param length
   * @returns {Array}
   */
  groupByLength(array = [], length) {
    const groupArr = [];
    if (array.length > length) {
      for (let i = 0; i < Math.ceil(array.length / length); i++) {
        groupArr[i] = array.slice(i * length, (i + 1) * length);
      }
      return groupArr;
    }
    groupArr[0] = array;
    return groupArr;
  }


  /**
   * 过滤已经爬取的文章url
   * @param urls
   */
  async filterUrls(urls = []) {
    const groupUrls = this.groupByLength(urls, 1000);
    let existUrls = [];
    for (let i = 0; i < groupUrls.length; i++) {
      let temp = await articleSerivce.findByUrls(groupUrls[i]);
      existUrls = existUrls.concat(temp.map(a => a.sourceUrl));
    }
    const notExist = urls.filter(v => !existUrls.includes(v));
    console.info(`￬￬￬￬￬￬￬￬￬￬￬￬￬￬过滤文章urls[共${existUrls.length}个]￬￬￬￬￬￬￬￬￬￬￬￬￬￬`);
    console.info(existUrls);

    return notExist;
  }


  /** @public api
   * [beginScraper description] 根据配置的json开始爬取任务
   * @method beginScraper
   * @param  {Array}      [scraperConfig=[]] [description]
   * @param  {Object}     [flowConfig={}]    [description]
   * @param  {[type]}     taskResultId       [description]
   * @param  {[type]}     journal            [description]
   * @return {Promise}                       [description]
   */
  async beginScraper(scraperConfig = [], flowConfig = {}, taskResultId, journal, middles = {}) {
    try {
      console.info(`${taskResultId} ：爬虫任务开始`);
      // 数据处理
      const config = this._handlerConfig(scraperConfig);

      // 爬取目录
      const catalog = config.catalog;
      let urls = {};
      for (let i = 0; i < catalog.length; i++) {
        urls = await this._multipleCatalogScrape(catalog[i], urls, flowConfig, i + 1);
      }

      urls = _.defaultsDeep(middles, urls);

      // 获取内容的地址
      const content = config.content;
      const contentUrls = this._getContentUrls(urls);
      if ((!contentUrls || contentUrls.length == 0) && content[0]) urls[content[0]] = SCRAPED_FLAG;
      let targets = (!contentUrls || contentUrls.length == 0) && content[0] ? [content[0]] : contentUrls;

      //过滤已经爬取过的文章url
      targets = await this.filterUrls(targets);
      
      console.info(`${taskResultId} ： 准备开始爬取文章 `);

      // 爬取内容
      await this._multipleContentScrape(content, targets, flowConfig, taskResultId, journal, urls);
      
      const progress = this._getScraperProgress(urls);
      await this._saveMiddles(urls, taskResultId, JSON.stringify(progress));
      console.info(`${taskResultId} ： 已组建好任务中间结构`);
      console.info(`${taskResultId} : 爬虫任务结束`);
      if (!progress.saved && progress.total) {
          console.log('progress.saved:',progress.saved)
          console.log('progress.total:',progress.total)
          throw new Error(`${taskResultId} : ${!progress.total ? '没有爬取到数据' : '爬取的数据保存失败'}`);
      }

    } catch (err) {
      throw err;
    }


  }

}

module.exports = Scraper;
