/**
 * Created by Edgar
 */

// import axios from 'axios'

import Toast from 'antd-mobile/lib/toast'

const reqNums = []

const showLoading = () => {
  // console.warn(reqNums);

  if(0===reqNums.length) Toast.loading('加载中...',0)
  reqNums.push(reqNums.length)
}

const hideLoading = () => {
  // console.warn(reqNums);
  reqNums.shift()
  if(0===reqNums.length) Toast.hide()
}
// axios 配置
axios.defaults.timeout = 60000
axios.defaults.showLoading = true
// axios.defaults.baseURL = 'https://api.github.com'

// http request 拦截器
axios.interceptors.request.use(
  config => {
    config.showLoading && showLoading()
    return config
  },
  err => {
    hideLoading()
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    hideLoading()
    return response.data;
  },
  error => {
    hideLoading()
    return Promise.reject(error)
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
  }
)

export default axios
