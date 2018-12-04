'use strict'

const scrapeIt = require('scrape-it');
const Promise = require('bluebird')
let tcpp = require('tcp-ping');
tcpp = Promise.promisifyAll(tcpp);

class ProxyMiddle {

  constructor() {
    this.proxyIps = [];
  }

  /**
   * 随机返回代理ip
   * @returns {Promise<*>}
   */
  async getproxyIp() {
    if (this.proxyIps != 0) {
      return this.proxyIps[parseInt(Math.random() * this.proxyIps.length)];
    } else {
      return '127.0.0.1';
    }
  }

  /**
   *
   * 更新代理ip地址
   * { ips:
     [ { ip: '117.68.194.179', port: '18118' },
       { ip: '119.28.138.104', port: '3128' }
     ]
   }
   * @returns {Promise<Array>}
   */
  async updateProxyList() {
    console.log('￬￬￬￬￬￬￬￬￬￬￬￬￬￬￬开始更新代理ip列表￬￬￬￬￬￬￬￬￬￬￬￬');

    let url = 'http://www.66ip.cn/index.html';
    const {data} = await scrapeIt(url, {
      ips: {
        listItem: '#main > div > div:nth-child(1) > table > tr', //ps: #main > table > tr 这样是无法获取的
        data: {
          ip: 'td:nth-child(1)',
          port: 'td:nth-child(2)'
        }
      }
    })
    console.log('成功获取网页内容');
    if (data && data.ips) {
      data.ips.shift();//删除首元素,不是真实的ip
      const proxyIps = data.ips.map(o => {
        return `${o.ip}:${o.port}`;
      })
      this.proxyIps = await this.filterProxyList(proxyIps);
    } else {
      this.proxyIps = [];
    }
    console.log(`新的代理ip列表:${this.proxyIps}`);
  }

  /**
   * 过滤无效的代理ip
   * @returns {Promise<Array>}
   */
  async filterProxyList(proxyList) {
    const useful = [];
    for (let i = 0; i < proxyList.length; i++) {
      const proxyurl = proxyList[i];
      try {
        console.log(`testing ${proxyurl}`);

        //检查代理ip的有效性,相当于telnet ip port
        const available = await tcpp.probeAsync(proxyurl.split(':')[0], proxyurl.split(':')[1]);
        if (available) useful.push(proxyurl);
        console.log(`available:${available}`);
      } catch (e) {
        console.error(e.message);
      }
    }
    return useful;
  }
}

async function timer() {
  await proxyMiddle.updateProxyList();
  setTimeout(timer, 10 * 60 * 1000);
}

const proxyMiddle = new ProxyMiddle();
//定期10分钟更新代理ip列表
timer();

module.exports = proxyMiddle;
