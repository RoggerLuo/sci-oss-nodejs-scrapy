'use strict';
const scraperjs = require('scraperjs');
const scrapeIt = require('scrape-it');
const pRetry = require('p-retry');
const asyncm = require('async');

module.exports = app => {

  const BULK_LIMIT = 1000;

  class Scraper extends app.Service {

    // 爬取网页并返回$
    _get$(url, flowConfig = {}, isStatic = true) {

      // 重试和延迟机制
      try {
        flowConfig.retries = flowConfig.retries || 0;
        flowConfig.timeout = flowConfig.timeout || 10000;

        return pRetry(run, flowConfig);

      } catch (err) {
        throw err;
      }

      function run() {
        const promise = new Promise((resolve, reject) => {
          const scraperPromise = scraperjs[ isStatic ? 'StaticScraper' : 'DynamicScraper' ].create();
          scraperPromise.request({
            uri: url,
            method: 'GET',
            timeout: flowConfig.timeout,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko)' +
									' Chrome/61.0.3163.100 Safari/537.36',
            },
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
      jsonConfig.forEach(function(val, idx) {
        const target = val.target;
        delete val.target;
        const seletors = _this._convertFn(val);
        configArray.push([ target, seletors ]);
      });
      const config = {};
      config.content = configArray[ configArray.length - 1 ];
      configArray.pop();
      config.catalog = configArray;
      return config;
    }


    // 转换convert成可执行函数
    _convertFn(obj, key = 'convert') {
      for (const k in obj) {
        if (k === key) {
          obj[ k ] = eval(obj[ k ]);
        } else if (typeof obj[ k ] === 'object') {
          this._convertFn(obj[ k ], key);
        }
      }
      return obj;
    }


    // 获取demo结果
    async getDemoResult(scraperConfig) {
      try {
        let url;
        const result = [];
        const config = this._handlerConfig(scraperConfig);
        const catalog = config.catalog;
        const content = config.content;

        // 查找目录
        for (let i = 0; i < catalog.length; i++) {``
          const $ = await this._get$(catalog[ i ][ 0 ], {
            retries: 5,
          });
          const scraperResult = scrapeIt.scrapeHTML($, catalog[ i ][ 1 ]);
          if (i < catalog.length - 1) catalog[ i + 1 ][ 0 ] = scraperResult.items[ 0 ].url;
          else url = scraperResult.items[ 0 ].url;
          result.push(scraperResult);
        }
        // 爬取内容
        url = url || content[ 0 ];
        const $ = await this._get$(url, {
          retries: 5,
        });
        result.push(scrapeIt.scrapeHTML($, content[ 1 ]));
        return result;
      } catch (err) {

        console.log(err);
        throw err;
      }

    }


  }

  return Scraper;
};
