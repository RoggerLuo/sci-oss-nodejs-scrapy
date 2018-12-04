'use strict'

//没成功启动
let chrome = require('selenium-webdriver/chrome');
let service = new chrome.ServiceBuilder()
  .loggingTo('/my/log/file.txt')
  .enableVerboseLogging()
  .build();

let options = new chrome.Options();

let driver = chrome.Driver.createSession(options, service);


async function example() {
  try {
    await driver.get('http://sci-hub.la/');
    await driver.findElement(By.name('request')).sendKeys('value', 'https://doi.org/10.1007/s41348-017-0077-9');
    await driver.findElement(By.id('open')).click();
  } finally {
    driver.sleep(20000)
    await driver.quit();
  }
}

example();
