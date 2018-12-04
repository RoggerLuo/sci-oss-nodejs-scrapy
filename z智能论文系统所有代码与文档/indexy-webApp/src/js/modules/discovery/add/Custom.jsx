import React from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import Icon from 'antd-mobile/lib/icon'
import InputItem from 'antd-mobile/lib/input-item'
import TextareaItem from 'antd-mobile/lib/textarea-item'
import Button from 'antd-mobile/lib/button'
import Toast from 'antd-mobile/lib/toast'
import List from 'antd-mobile/lib/list'
import { createForm } from 'rc-form'

import Path from '../../../app/path'
import Header from '../../../components/Header'
import CustomBar from './CustomBar'


@withRouter
@inject("discovery")
@observer
class addCustom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: ''
    }
  }
  componentDidMount() {
    if (this.props.location.pathname == `/discovery/addCustom`) {
      this.setState({
        title: '添加定制'
      })
    } else {
      this.setState({
        title: '修改定制'
      })
    }
  }
  goList = () => {
    this.props.history.push(Path.discovery.index.url)
  }
  goCustom = () => {
    //点击定制按钮
    let { pathname } = this.props.history.location,
      id = pathname.split('/')[2]
    this.props.form.validateFields((error, values) => {
      if(!error){
        if (this.props.location.pathname == `/discovery/addCustom`) {
          this.props.discovery.startCustom(this.goList())
        } else {
          this.props.discovery.editCustom(id, this.goList())
        }
      }else {
        if (!error.name) {
          if(!error.keyword || !error.title || !error.abstract) {
            if (this.props.location.pathname == `/discovery/addCustom`) {
              this.props.discovery.startCustom(this.goList())
            } else {
              this.props.discovery.editCustom(id, this.goList())
            }
          }else {
            Toast.fail('篇名、关键字、摘要至少需要填写一项', 2)
          }
        }else {
          Toast.fail('主题不能为空', 2)
        }
      }
    })
  }
  inputChange = (type, e) => {
    this.props.discovery.changeValue(type, e)
  }
  input = (type, title, placeholder) => {
    const { getFieldDecorator } = this.props.form;
    let data
    const { initCustom, customTitle } = this.props.discovery
    switch (type) {
      case 'name':
        data = customTitle
        break;
      case 'keyword':
        data = initCustom[0].value ? initCustom[0].value : ''
        break;
      case 'title':
        data = initCustom[1].value ? initCustom[1].value : ''
        break;
      case 'abstract':
        data = initCustom[2].value ? initCustom[2].value : ''
        break;
    }
    return (
      <div>
        {getFieldDecorator(type, {
          initialValue: data ? data : '',
          rules: [{
            required: true,
            message: '不能为空'
          }],
        })(
          <InputItem
            clear
            placeholder={placeholder}
            onChange={this.inputChange.bind(this, type)}
          >{title}</InputItem>
          )}
      </div>
    )
  }
  componentWillUnmount() {
    this.props.form.resetFields()
    this.props.discovery.sendCustomDetail([])
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { initCustom } = this.props.discovery
    const { title } = this.state
    const headerOptions = {
      text: title,
      leftContent: [
        <Icon type="left" />
      ],
      onLeftClick: this.props.history.goBack
    }
    return (
      <div className="custom">
        <Header headerOptions={headerOptions} />
        <div className="custom-cards">
          <div className="card">
            {this.input('name', '主题', '必填')}
            {/* <CustomBar type="theme" customDetail={customDetail.topicOper}/> */}
          </div>
          <div className="card">
            {this.input('title', '篇名', '请输入篇名')}
            <CustomBar type="title" customDetail={initCustom[1].condi} exact={initCustom[1].exact}/>
          </div>
          <div className="card">
            {this.input('keyword', '关键字', '请输入关键字')}
            <CustomBar type="keyword" customDetail={initCustom[0].condi} exact={initCustom[0].exact}/>
          </div>
          <div className="card">
            <div className="card-text">摘要</div>
            <div className="card-TextareaItem">
              {getFieldDecorator('abstract', {
                initialValue: initCustom[2].value ? initCustom[2].value : '',
                rules: [{
                  required: true,
                  message: '不能为空'
                }],
              })(
                <TextareaItem
                  editable
                  placeholder="点击输入摘要字段"
                  rows={3}
                  labelNumber={5}
                  clear
                  onChange={this.inputChange.bind(this, 'abstract')}
                />
              )}
            </div>
          </div>
          <Button type="primary" className="custom-btn" onClick={this.goCustom}>定制</Button>
        </div>
      </div>
    )
  }
}

const addCustomWrapper = createForm()(addCustom);
export default addCustomWrapper;
