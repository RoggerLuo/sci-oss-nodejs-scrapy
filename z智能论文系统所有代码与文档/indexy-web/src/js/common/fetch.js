/**
 * Created by levy on 2017/3/7.
 */

import notification from 'antd/lib/notification'
import Zepto from './zepto.min.js'


function ajax(options, successCb, errorCb) {
  if (successCb) {
    options.success = successCb
  }
  if (errorCb) {
    options.error = errorCb
  }
  Zepto.ajax(options)
}

export default function fetch(url, params) {
  let options = {
    contentType: 'application/json',
    timeout: 60000 * 2,
  }
  options.url = url
  if (params) {
    for (let key in params) options[key] = params[key]
  }
  // 注意查看Zetpo 文档 http://www.css88.com/doc/zeptojs_api/#$.ajax
  return new Promise((resolve, reject) => {
    ajax(options, data => resolve(data), err => {
      // https://ant.design/components/notification-cn/
      let config = {
        message: 'Something Bad Happened',
        description: err.responseText,
        duration: null,
        onClose: () => notification.destroy(),
      }
      /**
       * TODO 错误提示后，需要销毁notification
       * 防止出现通知容器覆盖可点击区域
       * 暂行方案，
       * 手动关闭notification
       */
      let status = `${err.status}`
      if (status.indexOf([400])) { // 需要处理特殊err code
        notification.error(config)
      }
      reject(err)
    })
  })
}

