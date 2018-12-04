const {Builder, By, Key, until} = require('selenium-webdriver');

//下载文件设置
const chrome = require('selenium-webdriver/chrome');
const options = new chrome.Options();
options.addArguments('download.default_directory', '/Users/chenshaowen/Downloads');

//user-agent
// const userAgent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36';
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/602.2.14 (KHTML, like Gecko) Version/10.0.1 Safari/602.2.14';
// options.addArguments('user-agent',userAgent);
options.addArguments([`user-agent=${userAgent}`]);

(async function example() {
  let driver = await new Builder().forBrowser('chrome')
    .usingServer('http://localhost:9515')
    .withCapabilities(options)
    // .setChromeOptions(new chrome.Options().headless())       //无头浏览器
    .build();
  try {
    await driver.get('http://sci-hub.la/');
    await driver.findElement(By.name('request')).sendKeys('https://doi.org/10.1007/s41348-017-0077-9');
    await driver.wait(until.elementLocated(By.id('open'), 2000)).click();

    await driver.findElement(By.xpath('//*[@id ="save"]/p/a')).click();
    await driver.sleep(5000);
  } finally {
    await driver.quit();
  }
})();


//目前的问题：
//点击open后跳转到了403


