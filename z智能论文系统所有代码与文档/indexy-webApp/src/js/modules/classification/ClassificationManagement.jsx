/**
 * Created by qingkong on 2018/3/6
 */
import React from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import NavBar from '../../components/Header'
import { createForm } from 'rc-form';
import List from 'antd-mobile/lib/list'
import SwipeAction from 'antd-mobile/lib/swipe-action'
import Modal from 'antd-mobile/lib/modal'
import InputItem from 'antd-mobile/lib/input-item'
import Button from 'antd-mobile/lib/button'
import Picker from 'antd-mobile/lib/picker'
import Toast from 'antd-mobile/lib/toast'
import path from '../../app/path'

const Item = List.Item;
const alert = Modal.alert;

@withRouter
@inject("discovery")
@inject("home")
@inject('label')
@observer
export default class ClassificationManagement extends React.Component {
  componentDidMount() {
    // this.props.home.getLabel()
  }
  goAdd = () => {
    this.props.history.push(path.ClassificationManagement.add.url)
  }
  edit = (item) => {
    this.props.home.sendClassification(item)
    this.props.history.push(`/ClassificationManagement/add/${item.id}`)
  }
  del = (id) => {
    this.props.label.delLabel(id)
  }
  render() {
    let { label } = this.props.label
    const headerOptions = {
      rightContent: [<i className="iconfont icon-tianjiajiahaowubiankuang" onClick={this.goAdd}/> ],
      text: null,
      leftContent: [
        <i className="iconfont icon-xiangxia-copy" onClick={this.props.history.goBack} />,
        <span>管理收藏分类</span>
      ]
    }
    return (
      <div className="ClassificationManagement">
        <NavBar headerOptions={headerOptions} />
        <List>
          {
            label.length > 0 ?
              label.map((item, index) => {
                return (
                  <SwipeAction
                    key={index}
                    style={{ backgroundColor: 'gray' }}
                    autoClose
                    right={[
                      {
                        text: '编辑',
                        onPress: this.edit.bind(this,item),
                        style: { backgroundColor: '#6da7ff', color: '#ffffff', width: '2rem' },
                      },
                      {
                        text: '删除',
                        onPress: () => alert('确认删除该分类？', '该分类下的论文不会被删除', [
                          { text: '取消', onPress: () => {} },
                          { text: '确认', onPress: this.del.bind(this,item.id) },
                        ]),
                        style: { backgroundColor: '#CCCCCC', color: '#ffffff', width: '2rem' },
                      },
                    ]}
                  >
                    <List.Item
                      extra={[<span key={index}><i className="iconfont icon-iconfontgengduo-copy"/></span>]}
                      key={index}
                    >
                      <div>{item.name}</div>
                    </List.Item>
                  </SwipeAction>
                )
              }): null
          }
        </List>
      </div>
    )
  }
}

