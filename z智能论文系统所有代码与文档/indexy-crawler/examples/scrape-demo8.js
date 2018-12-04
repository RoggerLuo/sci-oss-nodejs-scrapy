
'use strict';
const scraperjs = require('scraperjs');
const scrapeIt = require('scrape-it');
const pRetry = require('p-retry');
const asyncm = require('async');

const BULK_LIMIT = 10;

class Scraper {

    //爬取网页并返回$
    _get$(url, flowConfig = {} , isStatic = true) {

        //重试和延迟机制
        try{
            flowConfig.retries = flowConfig.retries || 0 ;
            flowConfig.timeout = flowConfig.timeout || 5000;

            return  pRetry ( run , flowConfig );

        }catch(err){
            throw err ;
        }

        function run () {
            let promise = new Promise((resolve, reject) => {
                let scraperPromise = scraperjs[isStatic ? "StaticScraper" : "DynamicScraper"].create();
                scraperPromise.request({
                    uri: url,
                    method: 'GET',
                    timeout : flowConfig.timeout,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko)' +
                        ' Chrome/61.0.3163.100 Safari/537.36'
                    }
                }).delay( flowConfig.delay || 0 )
                    .onStatusCode(404, () => {
                        throw new pRetry.AbortError(`${url} : 404 not found`);
                    }).scrape($ => {
                    resolve($);
                }).catch(err => {
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
        let configArray = [];
        jsonConfig.forEach(function (val, idx) {
            let target = val.target;
            delete val.target;
            let seletors = _this._convertFn(val);
            console.log(seletors);
            configArray.push([target, seletors]);
        });
        let config = {};
        config.content = configArray[configArray.length - 1];
        configArray.pop();
        config.catalog = configArray;
        return config;
    }

    //多个爬取，主要考虑到需爬取的目标可能有多个,可设置延时，并行
    async _multipleCatalogScrape(config, urls = {} , flowConfig = {}) {
        try{
            let targets = config[0] ? [config[0]] : Object.keys(urls);
            flowConfig.concurrency = flowConfig.concurrency || 1;
            var promise = new Promise ( (resolve , reject) =>{
                asyncm.eachLimit( targets , flowConfig.concurrency , async (target , done) =>{
                    if (config[0]) {
                        urls = await this._scraperForCatalog([target, config[1], config[2]]);
                    } else {
                        urls[target] = await this._scraperForCatalog([target, config[1], config[2]]);
                    }
                    done();
                }, err =>{
                    err ? reject(err) : resolve(urls);
                });
            });
            return  promise;
        }catch (err){
            console.error(err);
            return urls ;
        }
    }

    //爬取多个内容
    async _multipleContentScrape( content , targets , flowConfig = {} , taskResultId){

        flowConfig.concurrency = flowConfig.concurrency || 1;
        let result = [];
        let promise = new Promise ( (resolve , reject) =>{
            asyncm.eachLimit( targets , flowConfig.concurrency , async (target , done) =>{
                var scraperContent = await this._scraperForContent([target, content[1]] , flowConfig , taskResultId);
                result.push(scraperContent);
                //批量存储
                if ( result.length >= BULK_LIMIT ){
                    try {
                        let tmpResult = result ;
                        result = [];
                        this.saveResult ( tmpResult );
                    }catch (err){
                        console.log ( err );
                    }
                }
                done();
            }, err =>{
                if ( err ){
                    reject(err)
                }else{
                    this.saveResult ( result );
                    resolve(result);
                }
            });
        });

        return promise;

    }

    //爬取目录，若有翻页则递归爬取
    async _scraperForCatalog(config , flowConfig = {}) {
        let urls = {};
        try{
            let $ = await this._get$(config[0] , flowConfig);
            let result = scrapeIt.scrapeHTML($, config[1]);
            result.items.forEach(function (val, idx) {
                urls[val.url] = 1;
            });
            if (result.nextPage) {
                config[0] = result.nextPage;
                return Object.assign(urls, await this._scraperForCatalog(config));
            } else {
                return urls;
            }
        }catch (err) {
            console.error (err);
            return urls;
        }
    }

    // 爬取内容
    async _scraperForContent(config , flowConfig = {} , taskResultId) {
        try{
            let $ = await this._get$(config[0] , flowConfig);
            let result = scrapeIt.scrapeHTML($, config[1]);
            result.sourceUrl = config[0];
            result.taskResult_id = taskResultId ;
            return result;
        }catch (err){
            console.error (err);
            return null ;
        }

    }

    //转换convert成可执行函数
    _convertFn ( obj , key = "convert"){
        for( let k in obj ){
            if ( k === key ){
                obj[k] =  eval(obj[k]);
            }else if ( typeof obj[k] === "object" ){
                this._convertFn( obj[k], key );
            }
        }
        return obj;
    }

    // 爬取目录后获取文章的地址列表
    _getContentUrls(obj, val = 1) {
        var urls = [];
        for (let k in obj) {
            if (obj[k] === val) {
                urls.push(k);
            } else {
                urls = urls.concat(this._getContentUrls(obj[k], val));
            }
        }
        return urls;
    }

    // 存储结果
    async saveResult ( result ) {
        try {
            console.log(result);
            console.log(result.length);
            console.log("-------------");
        } catch (err) {
            throw err ;
        }
    }

    //获取demo结果
    async getDemoResult ( scraperConfig ) {
        try {
            let url ;
            let result = [];
            let config = this._handlerConfig(scraperConfig);
            let catalog = config.catalog ;
            let content = config.content ;

            //查找目录
            for ( let i = 0 ; i < catalog.length ; i++ ) {
                let $ = await this._get$( catalog[i][0] , { retries : 5 } );
                let scraperResult = scrapeIt.scrapeHTML($, catalog[i][1]);
                if ( i < catalog.length-1 ) catalog[i+1][0] = scraperResult.items[0].url ;
                else url = scraperResult.items[0].url ;
                result.push( scraperResult );
            }
            //爬取内容
            url = url || content[0] ;
            let $ = await this._get$( url , { retries : 5 } );
            result.push ( scrapeIt.scrapeHTML( $ , content[1]) );
            return result;
        }catch (err){

            console.log ( err );
            throw err ;
        }

    }

    // 根据配置的json开始爬取任务
    async beginScraper(scraperConfig = [], flowConfig = {} , taskResultId) {

        //数据处理
        let config = this._handlerConfig(scraperConfig);

        //爬取目录
        let catalog = config.catalog;
        let urls = {};
        for (let i = 0; i < catalog.length; i++) {
            urls = await this._multipleCatalogScrape(catalog[i], urls, flowConfig);
        }

        //获取内容的地址
        let content = config.content;
        let contentUrls = this._getContentUrls(urls);
        if ( ( !contentUrls || contentUrls.length == 0 ) && content[0]) urls[content[0]] = 1;
        console.log(urls);
        let targets = ( !contentUrls || contentUrls.length == 0 ) && content[0] ? [content[0]] : contentUrls;
        console.log(targets.length);
        //爬取内容
        let result = this._multipleContentScrape( content , targets , flowConfig , taskResultId);
        return result;

    }


}
let scraperConfig = [
    // 两层结构的
    {
        target: "http://www.nykxw.com/info.asp?base_id=5&third_id=449&pageIndex=1",
        items: {
            listItem: ".list.inside li",
            data: {
                url: {selector: "a", attr: "href", convert: "new Function( \"x\" , \"return 'http://www.nykxw.com/' + x\")" }
            }
        },
        nextPage: {
            selector: "div.page > span:nth-child(1) > a:nth-child(6)",
            attr: "href",
            convert: "new Function (\"x\" , \"return !x || x === 'javascript:void(0);' ? null : 'http://www.nykxw.com/info.asp'+x \")"
        }
    },
    {
        title: ".detail1.clearfix h2",
        author: ".articleTable tr:nth-child(1) > td:nth-child(2)",
        summary: ".articleTable tr:nth-child(9) > td:nth-child(2)",
        publishTime: {
            selector : ".articleTable tr:nth-child(5) > td:nth-child(2)"  ,
            convert : "new Function('x' , 'return new Date(x)')"
        },
        keywords : ".articleTable tr:nth-child(8) > td:nth-child(2)",
        publisher : {
            selector : ".sCon p:nth-child(1)",
            trim : true
        }
    }
    /*{
        target: 'http://www.cqvip.com/QK/96566A/',
        items: {
            listItem : "ol li a",
            data : {
                url : {selector: "" , attr: "href" , convert: `new Function('x' , 'return "http://www.cqvip.com" + ')`}
            }
        }
    },
    {
        items: {
            listItem : "ul em",
            data : {
                url : {selector: "a" , attr: "href" , convert: `new Function('x' , 'return "http://www.cqvip.com" + ')`}
            }
        }
    },
    {
        target : "http://www.cqvip.com/QK/96566A/201704/673048506.html",
        title : ".detailtitle h1",
        author : "span.detailtitle > strong > i ",
        summary : {selector : ".sum" , how: "text" , trim:true}
    }*/
];

let flowConfing = {
    retries: 5,
    concurrency: 2,
    delay: 0,
    timeout: 10000
}
var scraper = new Scraper();
scraper.beginScraper( scraperConfig , flowConfing , 'sw');


