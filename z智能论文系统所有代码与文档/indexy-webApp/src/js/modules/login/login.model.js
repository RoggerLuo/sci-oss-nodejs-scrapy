/**
 * Created by qingkong on 2017/11/22.
 */

import {observable, action, runInAction} from 'mobx'
import fetch from '../../common/fetch'
import api from './api'
import Toast from 'antd-mobile/lib/toast'
import {getToken, writeCookie} from '../../utils/cookies'

import ErrorToast from "../../components/ErrorToast";

export default class loginStore{
  //登录注册页面数据
  @observable phone = ''
  @observable password = ''
  @observable onSubmit = false
  @observable hasError = false
  @observable loginLoading = false
  @observable passwordError = false
  @observable next = false
  @observable thirdDisplay = 'block'
  @observable isInterested = false

  @action sendAccount(type,e){
    //传递账户信息
    switch (type){
      case 'phone':
        this.phone = e;
        break;
      case 'password':
        this.password = e;
        break;
    }
  }
  @action passwordErrorChange(e){
    this.passwordError = e
  }
  @action changeDisplay(e) {
    //input框失去焦点 出现第三方账号登录
    this.thirdDisplay = e
  }
  @action async submit(e,callback) {
    //登录
    runInAction(() => {
      this.loginLoading = true
    })
    let res
    try {
      let resp = await fetch(api.login, {
        headers: {'Content-Type':'application/json'},
        method: 'POST',
        data: JSON.stringify(e)
      })
      runInAction(() => {
        res = resp.payload
        this.loginLoading = false
        writeCookie('token', res.token)
        writeCookie('userID', res.user_id)
        this.onSubmit = true
        this.getInterested(res.user_id, callback)
      })
    }catch(error) {
      runInAction(() => {
        this.loginLoading = false
      })
      ErrorToast(error,'登录失败...')
    }
  }
  @action async register(e,props,url){
    //注册
    runInAction(() => {
      this.loginLoading = true
    })
    let newObj = Object.assign({}, e)
    try {
      let resp = await fetch(api.register, {
        headers: {'Content-Type':'application/json'},
        method: 'POST',
        data: JSON.stringify(newObj)
      })
      runInAction(() => {
        if(resp.success === true){
          Toast.success('注册成功', 3)
          this.loginLoading = false
          props.history.push(url)
          this.reset()
        }else {
          this.loginLoading = false
          Toast.fail(resp.message, 3)
        }
      })
    }catch(error) {
      runInAction(() => {
        this.loginLoading = false
      })
      ErrorToast(error,'注册失败...')
    }
  }
  @action nextChange(){
    //忘记密码时点击下一步
    this.next = !this.next
  }
  @action hasErrorChange(e){
    //注册手机号验证
    this.hasError = e
  }
  @action async getInterested(userId, callback) {
    //判断用户有没有关注过领域
    try {
      let resp = await fetch(api.isInterested(userId))
      runInAction(() => {
        if(resp.payload==='1') {
          this.isInterested = true
        }
        else {
          this.isInterested = false
        }
      })
      callback()
    } catch(error) {
      ErrorToast(error,'获取错误...')
    }

  }
  @action reset(){
    //初始化数据
    this.phone = ''
    this.password = ''
    this.hasError = false
    this.passwordError = false
    this.next = false
  }
}
