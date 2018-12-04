/**
 * Created by miffy on 2017/11/30
 */
import React from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import List from 'antd-mobile/lib/list'
import Logo from '../../components/Logo'
import WhiteSpace from 'antd-mobile/lib/white-space'
import SegmentedControl from 'antd-mobile/lib/segmented-control'
import NavBar from '../../components/Header'
import path from '../../app/path'
import './my.less'

const Item = List.Item;
const Brief = Item.Brief;

@withRouter
// @observer
export default class my extends React.Component {
  render() {
    const headerOptions = {
      rightContent: null,
      text: '我的',
      leftContent: null
    }
    return (
      <div className="my">
        <NavBar headerOptions={headerOptions} />
        <div className="content">
          <List className="about-me">
            <Item
              arrow="horizontal"
              thumb={<Logo name="parki" width="1.5rem" height="1.5rem"/>}
              multipleLine
              onClick={() => {}}
              extra={<i className="iconfont icon-erweima"/>}
            >
              <div className="my-name">Parki</div>
              <Brief className="my-brief">领域：健康减肥学</Brief>
              <WhiteSpace className="border"/>
              <WhiteSpace/>
              <div className="my-attention">
                <span className="my-following" onClick={() => this.props.history.push(path.my.concern.url)}>关注: 10 </span>
                <span className="my-follower">粉丝: 200</span>
              </div>
            </Item>
          </List>
          <List>
            <Item
              thumb={<i className="iconfont icon-renxiang"/>}
              arrow="horizontal"
              onClick={() => {}}
            >个人资料</Item>
          </List>
          <List className="my-collection">
            <Item
              thumb={<i className="iconfont icon-gouwudai"/>}
              arrow="horizontal"
              onClick={() => {}}
            >我的购买</Item>
            <Item
              thumb={<i className="iconfont icon-shoucang"/>}
              arrow="horizontal"
              onClick={() => {}}
            >我的收藏</Item>
            <Item
              thumb={<i className="iconfont icon-shangchuan-copy"/>}
              arrow="horizontal"
              onClick={() => {}}
            >我的上传</Item>
          </List>
          <List className="my-note">
            <Item
              thumb={<i className="iconfont icon-shuji"/>}
              arrow="horizontal"
              onClick={() => {}}
            >我的论著</Item>
            <Item
              thumb={<i className="iconfont icon-jichuxinxi"/>}
              arrow="horizontal"
              onClick={() => {}}
            >我的笔记</Item>
          </List>
          <List className="my-wallet">
            <Item
              thumb={<i className="iconfont icon-qianbao"/>}
              arrow="horizontal"
              onClick={() => {}}
            >我的钱包</Item>
          </List>
        </div>
      </div>
    )
  }
}

