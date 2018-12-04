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
  async getproxyIps() {
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
    let url = 'http://www.xicidaili.com/nn/';
    const {data} = await scrapeIt(url, {
      ips: {
        listItem: '.odd',
        data: {
          ip: 'td:nth-child(2)',
          port: 'td:nth-child(3)'
        }
      }
    })
    if (data && data.ips) {
      const proxyIps = data.ips.map(o => {
        return `${o.ip}:${o.port}`;
      })
      this.proxyIps = await this.filterProxyList(proxyIps);
    }
    return [];
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

const proxyMiddle = new ProxyMiddle();

setTimeout(proxyMiddle.updateProxyList, 5 * 60 * 1000);
