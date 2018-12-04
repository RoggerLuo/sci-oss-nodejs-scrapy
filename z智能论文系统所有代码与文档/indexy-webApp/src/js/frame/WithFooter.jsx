import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import TabBar from 'antd-mobile/lib/tab-bar'
import path from '../app/path'

import './app.less'
import Index from '../../images/home/首页@2x.png'
import Index1 from '../../images/home/首页1@2x.png'
import discovery from '../../images/home/发现@2x.png'
import discovery1 from '../../images/home/发现1@2x.png'
import work from '../../images/home/工作@2x.png'
import work1 from '../../images/home/工作1@2x.png'
import message from '../../images/home/提醒@2x.png'
import message1 from '../../images/home/消息@2x.png'
import my from '../../images/home/我的@2x.png'
import my1 from '../../images/home/我的1@2x.png'

@withRouter
// @observer
export default class WithFooter extends Component {

  handleTabbarPress = (targetName) => {
    // this.props.home.chengeSelectedTab(targetName)
    if (targetName === 'home') {
      this.props.history.push(path.home.url)
      return
    }
    if (targetName === 'discovery') {
      this.props.history.push(path.discovery.index.url)
      return
    }
    if (targetName === 'work') {
      this.props.history.push(path.work.url)
      return
    }
    if (targetName === 'msg') {
      this.props.history.push(path.message.url)
      return
    }
    if (targetName === 'account') {
      this.props.history.push(path.my.index.url)
      return
    }
  }
  render() {
    let withoutFooter = [
      //需要隐藏底部的url
      path.details.url,
      path.periodicalDetail.url,
      path.interested.index.url,
      path.interested.subdivision.url,
      path.authorDetail.url,
      path.editCustom.url,
      path.search.url,
      path.classification.url,
      path.ClassificationManagement.url,
      path.read.url,
      path.result.url,
      path.discovery.add.url,
      path.discovery.addAuthor.url,
      path.discovery.addPeriodical.url,
      path.discovery.addCustom.url,
      path.discovery.addField.url,
    ]
    let href = this.props.history.location.pathname,
      hrefArr = href.split('/'),
      hideFooter = false
    withoutFooter.forEach((item) => {
      let bool = href.indexOf(item)
      if (bool > -1) {
        hideFooter = true
      }
    })
    return (
      <div className="with-footer">
        {this.props.children}
        <div className="footer-bar" style={{ display: hideFooter ? "none" : "block" }}>
          <TabBar
            unselectedTintColor="#949494"
            tintColor="#33A3F4"
            barTintColor="white"
            hidden={hideFooter}
          >
            <TabBar.Item
              title="首页"
              key="home"
              icon={<img className="iconfont" src={Index} />}
              selectedIcon={<img className="iconfont" src={Index1} />}
              data-seed="logId"
              onPress={this.handleTabbarPress.bind(this, 'home')}
              selected={href === path.home.url}
            >
            </TabBar.Item>
            <TabBar.Item
              icon={<img className="iconfont" src={discovery} />}
              selectedIcon={<img className="iconfont" src={discovery1} />}
              title="关注"
              key="discovery"
              data-seed="logId1"
              onPress={this.handleTabbarPress.bind(this, 'discovery')}
              selected={href === path.discovery.index.url}
            >
            </TabBar.Item>
            <TabBar.Item
              icon={<img className="iconfont" src={work} />}
              selectedIcon={<img className="iconfont" src={work1} />}
              title="工作"
              key="work"
              selected={href === path.work.url}
              onPress={this.handleTabbarPress.bind(this, 'work')}
            >
            </TabBar.Item>
            {/*<TabBar.Item*/}
            {/*icon={<img className="iconfont" src={message} />}*/}
            {/*selectedIcon={<img className="iconfont" src={message1} />}*/}
            {/*title="消息"*/}
            {/*key="msg"*/}
            {/*selected={href === path.message.url}*/}
            {/*onPress={this.handleTabbarPress.bind(this, 'msg')}*/}
            {/*>*/}
            {/*</TabBar.Item>*/}
            <TabBar.Item
              icon={<img className="iconfont" src={my} />}
              selectedIcon={<img className="iconfont" src={my1} />}
              title="我的"
              key="account"
              selected={href === path.my.index.url || href === path.my.concern.url}
              onPress={this.handleTabbarPress.bind(this, 'account')}
            >
            </TabBar.Item>
          </TabBar>
        </div>
      </div>
    )
  }
}
