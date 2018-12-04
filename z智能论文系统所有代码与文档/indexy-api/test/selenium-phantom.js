//
// const phantom = require('phantom');
// const cheerio = require('cheerio');
//
//
// async function test() {
//   const instance = await phantom.create();
//   const page = await instance.createPage();
//   await page.on('onResourceRequested', function(requestData) {
//     console.info('Requesting', requestData.url);
//   });
//   const status = await page.open('http://sci-hub.la/');
//   console.log(status);
//   console.log(cheerio);
//   const content = await page.evaluate(function() {
//     console.log(document.getElementsByName('request')[0].innerHTML);
//     document.getElementsByName('request')[0].setAttribute('value', 'https://doi.org/10.1007/s41348-017-0077-9');
//     document.getElementById('open').click();
//   });
//   // const content = await page.property('content');
//
//   console.log(content);
//
//   await instance.exit();
// }
//
// test();
//

//能打开网页模拟点击，但还没做到下载pdf
const chromedriver = require('chromedriver');
const {Builder, By, Key, until} = require('selenium-webdriver');

async function example() {
  let driver = await new Builder()
    .forBrowser('chrome')
    .build();
  try {
    await driver.get('http://sci-hub.la/');
    await driver.findElement(By.name('request')).sendKeys('value', 'https://doi.org/10.1007/s41348-017-0077-9');
    // driver.setDownloadPath("/Users/chenshaowen/Downloads");
    await driver.findElement(By.id('open')).click();
  } finally {
    driver.sleep(20000)
    await driver.quit();
  }
}

example();
