/**
 * Created by qingkong on 2017/11/22
 */
import React from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import List from 'antd-mobile/lib/list'
import InputItem from 'antd-mobile/lib/input-item';
import Button from 'antd-mobile/lib/button'
import { createForm } from 'rc-form';
import NavBar from '../../components/Header'
import Toast from 'antd-mobile/lib/toast'
import path from '../../app/path'
import { getToken } from '../../utils/cookies'
import api from './api'

import './login.less'

@withRouter
@inject('login')
@observer
class Login extends React.Component {
  componentDidMount() {
    if(getToken()){
      // this.props.history.push(path.interested.index.url)
      this.props.history.push(path.home.url)
    }
  }
  change = (type, e) => {
    //传递账户信息
    this.props.login.sendAccount(type, e)
  }
  goDashboard = () => {
    // //登录成功后，判断是否选择过感兴趣的领域 有则跳转到首页，否则跳转到兴趣页面
    // let {onSubmit, isInterested} = this.props.login
    // if(onSubmit&&isInterested) {
    //   //已经有感兴趣的领域
    //   this.props.history.push(path.home.url)
    // }
    // else if(onSubmit&&!isInterested) {
    //   this.props.history.push(path.interested.index.url)
    // }

    // 以上暂时屏蔽，直接跳首页
    const { location: { state }, history } = this.props
    history.push((state&&state.from)||path.home.url)
  }
  login = () => {
    let { phone, password } = this.props.login
    let values = { username: phone, password: password },
      bool = phone.replace(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/g, '')
    if (!phone || !password) {
      Toast.fail('手机号、密码不得为空', 2)
    }
    else if (bool) {
      ////注册手机号验证
      Toast.fail('请输入11位手机号码', 2)
    }
    if (!bool && password) {
      this.props.login.submit(values,this.goDashboard);
    }
  }
  componentWillUnmount() {
    //离开页面时，初始化数据
    this.props.login.reset()
  }
  changeRegister = () => {
    this.props.history.push(path.register.url)
  }
  onBlur = () => {
    //input框失去焦点 出现第三方账号登录
    this.props.login.changeDisplay('block')
  }
  onFocus = () => {
    this.props.login.changeDisplay('none')
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let { phone, password, loginLoading, thirdDisplay } = this.props.login
    const headerOptions = {
      //navbar相应信息
      text: 'Indexy',
      icon: null,
      onLeftClick: null,
      rightContent: [
        <span onClick={this.changeRegister} className="register">注册</span>
      ]
    }
    return (
      <div className="Login">
        <div className="Login-content">
          <NavBar headerOptions={headerOptions} />
          <div className="user-form">
            <List>
              {
                phone ? <span className="placeholder">手机号</span> : null
              }
              {getFieldDecorator('username', {
                initialValue: phone ? phone : '',
                rules: [{
                  required: true
                }],
              })(
                <InputItem
                  onBlur={this.onBlur}
                  onFocus={this.onFocus}
                  clear
                  type="number"
                  placeholder="手机号"
                  onChange={this.change.bind(this, 'phone')} />
              )}
              {getFieldDecorator('password', {
                initialValue: password ? password : '',
                rules: [{
                  required: true
                }],
              })(
                <InputItem
                  onBlur={this.onBlur}
                  onFocus={this.onFocus}
                  clear
                  type="password"
                  placeholder="密码"
                  onChange={this.change.bind(this, 'password')} />
              )}
              <Button loading={loginLoading} onClick={this.login} type="primary">登录</Button>
            </List>
            {/* <u onClick={() => this.props.history.push(path.forgetPassword.url)} className="forget">忘记密码？</u> */}
          </div>
          {/* <div className="other-Login" style={{display: thirdDisplay}}>
           <span>——第三方账号登录——</span>
           <div className="other-icon">
           <i className="iconfont icon-weixin" />
           <i className="iconfont icon-QQ" />
           <i className="iconfont icon-weibo" />
           <i className="iconfont icon-gongnengyedoubanfanshe" />
           </div>
           </div> */}
        </div>
      </div>
    )
  }
}

const LoginWrapper = createForm()(Login);
export default LoginWrapper;
