/**
 * Created by qingkong on 2017/11/23
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


@withRouter
@inject('login')
@observer
class Register extends React.Component {
  change = (type,e) => {
    //传递账户信息
    if(type == 'phone'){
      if (e.replace(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/g, '')) {
        ////注册手机号验证
        this.props.login.hasErrorChange(true)
      } else {
        this.props.login.hasErrorChange(false)
      }
    }
    if(type == 'password'){
      if(!e){
        this.props.login.passwordErrorChange(true)
      }else {
        this.props.login.passwordErrorChange(false)
      }
    }
    this.props.login.sendAccount(type,e)
  }
  onErrorClick = () => {
    if (this.props.login.hasError) {
      Toast.fail('请输入11位手机号码');
    }
  }
  onPasswordErrorClick = () => {
    if (this.props.login.password) {
      Toast.fail('密码格式不正确');
    }else {
      Toast.fail('密码不能为空');
    }
  }
  register = () => {
    let { phone, password } = this.props.login
    let values = {username: phone, password: password }
    if(!phone||!password ) {
      Toast.fail('手机号、密码不得为空',2)
    }else if (phone.replace(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/g, '')) {
        ////注册手机号验证
        Toast.fail('请输入11位手机号码',2)
      }
      else {
        this.props.login.register(values, this.props, path.login.url)
    }
  }
  componentWillUnmount() {
    //离开页面时，初始化数据
    this.props.login.reset()
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let { phone, password, hasError, passwordError } = this.props.login
    const headerOptions = {
      //navbar相应信息
      text: 'Indexy',
      icon: null,
      onLeftClick: null,
      rightContent: [
        <span onClick={() => this.props.history.push(path.login.url)} className="register">登录</span>
      ]
    }
    return (
      <div className="Register">
        <div className="Register-content">
          <NavBar headerOptions={headerOptions} />
          <div className="user-form">
            <List>
              {
                phone.length>0?<span className="placeholder">手机号</span>:null
              }
              {getFieldDecorator('username', {
                initialValue: phone?phone:'',
                rules: [{
                  required: true,
                  pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/g,
                }],
              })(
                <InputItem
                  clear
                  error={hasError}
                  onErrorClick={this.onErrorClick}
                  type="number"
                  placeholder="手机号"
                  onChange={this.change.bind(this,'phone')}/>
              )}
              {getFieldDecorator('password', {
                initialValue: password?password:'',
                rules: [{
                  required: true
                }],
              })(
                <InputItem
                  clear
                  error={passwordError}
                  onErrorClick={this.onPasswordErrorClick}
                  type="password"
                  placeholder="密码"
                  onChange={this.change.bind(this,'password')}/>
              )}
              <Button onClick={this.register} type="primary">注册</Button>
            </List>
          </div>
        </div>
      </div>
    )
  }
}

const RegisterWrapper = createForm()(Register);
export default RegisterWrapper;
