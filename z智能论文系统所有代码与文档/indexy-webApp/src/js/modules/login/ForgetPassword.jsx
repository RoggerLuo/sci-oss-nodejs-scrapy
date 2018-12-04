/**
 * Created by qingkong on 2017/9/5
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
class Index extends React.Component {
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
    this.props.login.sendAccount(type,e)
  }
  onErrorClick = (e) => {
    if (this.props.login.hasError) {
      switch (e){
        case 'phone':
          Toast.info('请输入11位手机号码');
          break;
        case 'password':
          Toast.info('密码格式不正确');
          break;
        case 'CDKey':
          Toast.info('验证码不正确');
          break;
      }
    }
  }
  onExtraClick = () => {
  }
  next = () => {
    this.props.login.nextChange()
  }
  register = () => {
    this.props.form.validateFields((err, values) => {
      if(!err){
      }else {
        if(this.props.form.getFieldError('phone')){
          this.props.login.hasErrorChange(true)
          Toast.fail('手机号不能为空',2)
        }else if(this.props.form.getFieldError('password')){
          this.props.login.hasErrorChange(true)
          Toast.fail('密码不能为空',2)
        }
      }
    })
  }
  componentWillUnmount() {
    //离开页面时，初始化数据
    this.props.login.reset()
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let { phone, password, hasError, next } = this.props.login
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
        <NavBar headerOptions={headerOptions} />
        <div className="user-form">
          <List>
            {
              phone?<span className="placeholder">手机号</span>:null
            }
            {
              next?<div>
                {getFieldDecorator('password', {
                  rules: [{
                    required: true
                  }],
                })(
                  <InputItem
                    clear
                    error={hasError}
                    onErrorClick={this.onErrorClick.bind(this,'password')}
                    type="password"
                    placeholder="新密码"
                    onChange={this.change.bind(this,'password')}/>
                )}
              </div>
                :
              <div>
                {getFieldDecorator('phone', {
                  rules: [{
                    required: true
                  }],
                })(
                  <InputItem
                    clear
                    error={hasError}
                    onErrorClick={this.onErrorClick.bind(this,'phone')}
                    type="phone"
                    placeholder="手机号"
                    onChange={this.change.bind(this,'phone')}/>
                )}
                {getFieldDecorator('CDKey', {
                  rules: [{
                    required: true
                  }],
                })(
                  <InputItem
                    clear
                    extra={<span className="extra">获取验证码</span>}
                    onExtraClick={this.onExtraClick}
                    type="number"
                    placeholder="验证码"
                    onChange={this.change.bind(this,'CDKey')}/>
                )}
              </div>
            }
            {
              next?<Button onClick={this.register} type="primary">确认</Button>
                :<Button onClick={this.next} type="primary">下一步</Button>
            }
          </List>
        </div>
      </div>
    )
  }
}

const IndexWrapper = createForm()(Index);
export default IndexWrapper;
