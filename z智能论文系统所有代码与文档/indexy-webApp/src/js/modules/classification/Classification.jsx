/**
 * Created by qingkong on 2018/3/5
 */
import React from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import NavBar from '../../components/Header'
import { createForm } from 'rc-form';
import List from 'antd-mobile/lib/list'
import Icon from 'antd-mobile/lib/icon'
import Button from 'antd-mobile/lib/button'
import Picker from 'antd-mobile/lib/picker'
import Toast from 'antd-mobile/lib/toast'
import path from '../../app/path'

import './classification.less'

//this.dislike()中判断selectKey选中值与label.id值是否相等，变换分类的style
Array.prototype.contains = function (needle) {
  for (let i in this) {
    if (this[i] == needle) return true;
  }
  return false;
}

@withRouter
@inject("discovery")
@inject("home")
@inject('label')
@observer
class Classification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectKeys: [],
      inputVisible: false,
      collection: '',
      status: ["unread"]
    };
  }
  componentDidMount() {
    this.props.label.getLabel()
    let { articleLabel } = this.props.home
    if(articleLabel.isCollection){
      let data = []
      articleLabel.collectionLabelIds.forEach((item) =>{
        data.push(item)
      })
      this.setState({
        selectKeys: data,
        status: [articleLabel.readStatus]
      })
    }
  }
  collect = () => {
    let { pathname } = this.props.history.location,
      { articleLabel } = this.props.home,
      method,
      id = pathname.split('/')[2]
    let { selectKeys, status } = this.state
    if (selectKeys.length > 0) {
        articleLabel.isCollection ? method = 'PUT' : method = 'POST'
        this.props.home.addCollect( method, id, selectKeys, status[0], this.props.history.goBack() )
    } else {
      Toast.info('请选择分类', 2)
    }
  }
  goManagement = () => {
    this.props.history.push(path.ClassificationManagement.url)
  }
  inputChange = (e) => {
    this.setState({ collection: e })
  }
  add = () => {
    this.props.form.validateFields((error)=>{
      if(!error){
        this.props.label.addLabel(this.state.collection,this.onStatusChange())
      }else {
        Toast.fail('请输入内容', 2)
      }
    })
  }
  onStatusChange = () => {
    let inputVisible = this.state.inputVisible
    this.setState({
      inputVisible: !inputVisible,
      collection: '',
    })
    this.props.form.resetFields()
  }
  onSelect = (key) => {
    let keys = this.state.selectKeys
    if(keys.length>0){
      let status = false
      keys.map(index =>{
        if(index==key){
          status = true
        }
      })
      if(status){
        keys = keys.filter(id =>
          id !== key
        )
        status = false
      }else {
        keys.push(key)
      }
    }else {
      keys.push(key)
    }
    this.setState({
      selectKeys: keys,
    })
  }
  dislike = (e, selectKeys) => {
    //生成分类选项并根据selectKeys判断是否选中
    return e.map((item, index) => {
      let id = item.id.toString()
      return (
        <List.Item
          key={index}
          onClick={this.onSelect.bind(this, id)}
          style={{ backgroundColor: selectKeys.contains(id) ? '#4c4c4c' : '' }}
        >
          <div
            style={{
              color: selectKeys.contains(id) ? '#fff' : '',
              backgroundColor: selectKeys.contains(id) ? '#4c4c4c' : ''
            }}
          >{item.name}</div>
        </List.Item>
      )
    })
  }
  onOK = (e) => {
    this.setState({
      status: e
    })
  }
  goAdd = () => {
    this.props.history.push(path.ClassificationManagement.add.url)
  }
  render() {
    const readingStatus = [
      {
        label: '已读',
        value: "read"
      },
      {
        label: '未读',
        value: "unread"
      },
      ]
    const headerOptions = {
      rightContent: null,
      text: null,
      leftContent: [
        <i className="iconfont icon-xiangxia-copy" onClick={this.props.history.goBack} />,
        <span>论文分类</span>
      ]
    }
    let { selectKeys } = this.state
    let { label } = this.props.label
    return (
      <div className="classification">
        <NavBar headerOptions={headerOptions} />
        <div className="content">
          <List>
            <Picker data={readingStatus}
                    title="阅读状态"
                    value={this.state.status}
                    cols={1}
                    onOk={this.onOK} >
              <List.Item extra="horizontal">
                阅读状态
              </List.Item>
            </Picker>
            <List.Item className="item">
              <span>收藏分类</span>
              <span className="popover-span" onClick={this.goManagement}>管理</span>
            </List.Item>
          </List>
          <div>
            <List className="classification-list">
              {
                label.length > 0 ? this.dislike(label,selectKeys) : null
              }
              <List.Item
                onClick={this.goAdd}
                style={{ backgroundColor : '#fff' }}
              >
                <Icon type="plus" style={{ color : "#999" }}/>
              </List.Item>
            </List>
            <div className="popover-card">
              <Button type="primary" onClick={this.collect}>确定</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const ClassificationWrapper = createForm()(Classification);
export default ClassificationWrapper;
