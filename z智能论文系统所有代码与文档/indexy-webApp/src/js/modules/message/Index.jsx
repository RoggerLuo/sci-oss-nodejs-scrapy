/**
 * Created by miffy on 2017/11/29
 */
// 暂时隐藏该功能

import React from 'react'
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import NavBar from '../../components/Header'
import PullToRefresh from 'antd-mobile/lib/pull-to-refresh'
import ListView from 'antd-mobile/lib/list-view'
import List from 'antd-mobile/lib/list'
import Badge from 'antd-mobile/lib/badge'
const Item = List.Item;
const Brief = Item.Brief;
import './message.less'
import Logo from '../../components/Logo'

@withRouter
@inject("message")
@observer
export default class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: document.documentElement.clientHeight,
    };
  }
  componentDidMount() {
    const app = document.getElementsByClassName('nav-header')[0].offsetHeight
    const footerBar = document.getElementsByClassName('footer-bar')[0].offsetHeight
    const hei = document.documentElement.clientHeight - app - footerBar;
    this.timer = setTimeout(() => {
      this.setState({
        height: hei,
      });
    }, 600);
  }
  componentWillUnmount() {
    //离开页面时，初始化数据
    this.timer && clearTimeout(this.timer)
  }
  render() {
    const headerOptions = {
      //navbar相应信息
      text: '消息'
    }
    let { msgList } = this.props.message
    return (
      <div className="Message" ref={el => this.lv = el}>
        <NavBar headerOptions={headerOptions} />
        <div className="list-content" style={{ height: this.state.height, overflow: 'auto'}} >
          <List className="msg-list">
            <Item
              thumb={<div className="comment-icon list-icon"><i className="iconfont icon-xiaoxi2" /></div>}
              arrow="horizontal"
              multipleLine
              onClick={() => { }}>
              <div className="text">评论</div>
            </Item>
            <Item
              thumb={<div className="request-icon list-icon"><i className="iconfont icon-shenqing" /></div>}
              arrow="horizontal"
              multipleLine
              onClick={() => { }}>
              <div className="text">我发出的请求</div>
            </Item>
            <Item
              thumb={<div className="requested-icon list-icon"><i className="iconfont icon-shenhe2" /></div>}
              arrow="horizontal"
              multipleLine
              onClick={() => { }}>
              <div className="text">被请求</div>
            </Item>
            <Item
              thumb={<div className="work-icon list-icon"><i className="iconfont icon-tongzhi" /></div>}
              arrow="horizontal"
              multipleLine
              onClick={() => { }}>
              <div className="text">工作通知</div>
            </Item>
            {msgList && msgList.map((item, index) => {
              return <Item
              key={index}
                multipleLine
                align="top"
                thumb={<Logo name={item.name} width='45px' height='45px' />}
                onClick={() => { }}
              >
                {item.name}
                <Brief>{item.last}</Brief>
              </Item>
            })}
          </List>
        </div>
      </div>
    )
  }
}

