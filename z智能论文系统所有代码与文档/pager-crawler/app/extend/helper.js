'use strict';

const md5 = require('md5');


// this.ctx.helper
module.exports = {

  /**
   * [getRandomSalt 生成16位数字的随机盐]
   * @return {[type]} [description]
   */
  getRandomSalt() {
    let salt = Math.random().toString().substr(2, 16);
    for (let i = 0; i < 16 - salt.length; i++) {
      salt += '0';
      // console.log('加0');
    }
    return salt;
  },
  /**
   * [md5WithSale 加盐md5]
   * temp=md5(password + salt)
   * result=(temp[0]+salt[0]+temp[1]+temp[2]+salt[1]+....) 48位
   * @param  {[type]} password [description]
   * @return {[type]}          [description]
   */
  md5WithSale(password) {
    const salt = this.getRandomSalt();
    // console.log('salt:' + salt);

    password = md5(password + salt);

    // console.log('password:' + password);
    const cs = new Array(48);
    for (let i = 0; i < 48; i += 3) {
      cs[i] = password.substr(i / 3 * 2, 1);
      const c = salt.substr(i / 3, 1);
      // console.log('cs[i]:' + cs[i]);
      cs[i + 1] = c;
      cs[i + 2] = password.substr(i / 3 * 2 + 1, 1);
    }
    // console.log('cs:' + cs);
    return cs.join('');
  },


  /**
   * [verifyMd5 校验加盐后是否和原文一致]
   * 先从md5passwd中得出salt和cs1,再用cs1与md5(password + salt)比较
   * @param  {[type]} password [description]
   * @param  {[type]} md5passwd      [description]
   * @return {[type]}          [description]
   */
  verifyMd5(password, md5passwd) {
    const cs1 = new Array(32);
    const cs2 = new Array(16);
    for (let i = 0; i < 48; i += 3) {
      cs1[i / 3 * 2] = md5passwd.substr(i, 1);
      cs1[i / 3 * 2 + 1] = md5passwd.substr(i + 2, 1);
      cs2[i / 3] = md5passwd.substr(i + 1, 1);
    }
    const salt = cs2.join('');

    const nMd5 = md5(password + salt);

    console.log('nMd5:' + nMd5);
    console.log('salt:' + salt);
    return (nMd5 === cs1.join(''));
  },


};
