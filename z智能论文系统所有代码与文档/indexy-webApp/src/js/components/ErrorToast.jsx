/**
 * @module 错误提示组件
 *
 * 可将 catch 的 error 直接传入
 * 组件自行判断需显示的错误提示
 *
 * 举个栗子
 *  基本使用
 *    ErrorToast(error, '请求失败，请重试。')
 *
 *  也可以调整Toast的参数
 *
 *    ErrorToast(error, '超时了！', 1, true)
 *
 */
import React, { Component } from 'react'
import Toast from 'antd-mobile/lib/toast'

/**
 * 默认延迟
 * 单位 秒
*/
const defaultDuration = 3
/**
 * 是否启用遮罩层
 * 默认 true
 */
const defalutMask = true
/**
 * 关闭时的调用
 */
const onCloseFn = function () {}

/**
 * @method 输出错误提示
 * @param { object } error error对象
 * @param { (string|ReactNode) } msg 默认信息
 * @param { array } [options] Toast的一些默认参数
 */
export const ErrorToast = (error, msg, ...options) => {
  let [ duration = defaultDuration , mask = defalutMask, onClose = onCloseFn ] = options
  options = Object.assign({}, {duration, mask, onClose}, options)
  let message = ""
  console.error(error)
  if(error){
    if (error.response) {
      const resp = error.response
      message = resp.data&&resp.data.message
      if(!message){
        switch (resp.status) {
          case 400: message = '缺少参数，请联系开发人员'; break;
          // 由于401未出现过…暂不作处理
          case 401: ('401 清除token信息并跳转到登录页面','未出现过。');break;
          case 500: message = '网络延迟，请稍后再试!'; break;
        }
      }
    }else{
      // message = error.message
      error.message.indexOf('timeout') !== -1 && (message = '连接超时，请稍后再试。')
      error.message.toLowerCase() === ('request aborted') && (message = '连接中断，请稍后再试。')
      error.message.toLowerCase() === ('network error') && (message = '网络异常，请检查网络设置.')
    }
  }
  if(!message) message = msg||(error&& error.message)
  return Toast.fail(message, options.duration, options.onClose, options.mask )
}


export default ErrorToast
