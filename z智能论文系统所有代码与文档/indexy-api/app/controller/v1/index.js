'use strict';

// Restful Api 加载形式，详见：
// https://eggjs.org/zh-cn/basics/router.html
const path = require('path');
const fs = require('fs');

module.exports = app => {


  class IndexController extends app.Controller {

    // 根目录访问index.html
    async index() {
      this.ctx.body = fs.readFileSync(path.join(__dirname, '../../public/index.html'), 'utf-8');
    }
  }
  return IndexController;
};
