'use strict';

/**
 * 利用selenium根据论文doi码从网站 http://sci-hub.la 爬取pdf全文
 *
 * 参考:http://seleniumhq.github.io/selenium/docs/api/javascript/index.html
 *
 * download the firefoxdriver in :
 * https://github.com/mozilla/geckodriver/releases
 *
 * 【下载文件设置】
 * http://yizeng.me/2014/05/23/download-pdf-files-automatically-in-firefox-using-selenium-webdriver/
 */


const {EventEmitter} = require('events');
const {Builder, By, until} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const Article = require('../lib/service/article');
const fs = require('fs');
const path = require('path');
const seleniumOptions = require('../config').selenium.options;

const downloadPath = seleniumOptions.FIREFOX_OPTIONS.prefes["browser.download.dir"];
const remoteServer = seleniumOptions.FIREFOX_OPTIONS.remoteServer;
const request = require('request');
const userAgents = require('./userAgent');

// const proxyMiddle = require('./proxyMiddle');//代理ip中间件


class PdfScraper extends EventEmitter {

  async init(callback) {
    console.log(`seleniumOptions:${JSON.stringify(seleniumOptions)}`);

    //下载文件设置
    this.options = new firefox.Options();
    this.options.setPreference('browser.download.folderList', 2);//0:下载到桌面,2:自定义目录
    this.options.setPreference('browser.download.dir', downloadPath);//下载目录
    this.options.setPreference('browser.helperApps.neverAsk.saveToDisk', 'application/pdf');//指定不询问打开文件窗口的文件类型
    this.options.setPreference('pdfjs.disabled', true);//关闭pdf在线预览
    this.options.setPreference('plugin.scan.plid.all', false);
    this.options.setPreference('plugin.scan.Acrobat', '99.0');


    //考虑到如果采用多线程多driver的情况下需要频繁打开和关闭driver,因此采用单线程不关闭driver爬取pdf,这需要控制nats队列的消费速度=1
    this.driver = await new Builder().forBrowser(seleniumOptions.SELENIUM_BROWSER_NAME)
      .withCapabilities(this.options)
      .usingServer(remoteServer)
      .setFirefoxOptions(this.options.headless())       //无头浏览器
      .build();

    callback();
  }

  //爬取pdf全文
  async beginScraperPdf(articleId, doiCode) {
    const article = await Article.findById(articleId);
    if (!article) throw new Error(`找不到文章:${articleId}`);
    if (!!article.pdfUrl && fs.existsSync(path.join(downloadPath, article.pdfUrl))) {
      console.warn(`已经存在文件:${article.pdfUrl}`);
      return null;
    }

    try {
      //step1:模拟输入doiCode
      await this.driver.get('http://sci-hub.la/');
      await this.driver.wait(until.elementLocated(By.name('request'), 2000)).sendKeys(doiCode);
      await this.driver.wait(until.elementLocated(By.id('open'), 2000)).click();

      //step2:获取pdf地址 阻塞
      const element = this.driver.findElement(By.xpath('//*[@id ="save"]/p/a'));
      let pdfURL = await element.getAttribute("onclick");
      pdfURL = pdfURL.split('location.href=')[1].replace(/'/g, '');
      if (pdfURL.indexOf('http://') >= 0 || pdfURL.indexOf('https://') >= 0) {
        pdfURL = pdfURL.replace(/^http:\/\/|https:\/\//, '');
      }
      pdfURL = pdfURL.replace(/^\/\//, '');
      console.log(`pdfURL:${pdfURL}`);
      const fileName = pdfURL.replace(/\?.*/, '').substring(pdfURL.replace(/\?.*/, '').lastIndexOf('/') + 1);

      //step3:使用request下载文件,动态userAgent
      console.log(`准备下载文件:${fileName}`)
      let userAgent = userAgents[parseInt(Math.random() * userAgents.length)];

      const params = {url: pdfURL, headers: {'User-Agent': userAgent}};

      //ps:目前使用代理IP会出现dnsnotfound问题,先注释
      // const proxyIp = proxyMiddle.getproxyIp();
      // if (proxyIp != '127.0.0.1') params.proxy = proxyIp;
      const r = request(params);
      r.on('response', async function (res) {
        //确保下载回来的是pdf原文，而不是html
        if (res.headers['content-type'] != 'application/pdf') {
          console.error(`文件响应类型content-type:${res.headers['content-type']},不是pdf原文`);
          //TODO 识别验证码
          return;
        }
        res.pipe(fs.createWriteStream(path.join(downloadPath, fileName)));
        console.log(`文件${fileName}下载完成`);
        await Article.updatePdfUrlById(articleId, fileName);
      });
      return path.join(downloadPath, fileName);

    } catch (err) {
      console.error(`根据doiCode:${doiCode}爬取论文失败:${err.message}`)
      if (err.message.includes('Tried to run command without establishing a connection')) {
        await this.driver.quit();
        console.log(`firefox已断开连接,开始重新建立连接....`)
        this.init(() => {
          console.log('重新建立连接成功!')
        })
      } else {
        throw new Error(`根据doiCode:${doiCode}爬取论文失败:${err.message}`)
      }
    } finally {
      // await this.driver.quit();
    }
  }
}

const pdfScraper = new PdfScraper();
pdfScraper.init(() => {
  console.log('pdfScraper finished init!');
})
module.exports = pdfScraper;


//目前存在的问题
//1. 当没有正常爬取一个论文时，不会发送ack，此时会阻塞后面论文pdf的爬取,如何设置firefox的timeout
