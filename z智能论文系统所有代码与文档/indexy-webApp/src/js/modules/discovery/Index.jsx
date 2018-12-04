/**
 * Created by miffy on 2018/1/5
 */
import React from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import Tabs from 'antd-mobile/lib/tabs'
import Popover from 'antd-mobile/lib/popover'

import NavBar from '../../components/Header'
import Custom from './Custom'
import Periodicals from './PeriodicalsBlock'
import Fields from './Fields'
import Author from './Authors'
import path from '../../app/path'

import './discovery.less'

const Item = Popover.Item;

@withRouter
@inject("discovery")
@observer
export default class DiscoveryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: document.documentElement.clientHeight,
      visible: false,
      initialPage: 0,
      tabsPage: this.props.discovery.tabsPage
    };
  }
  componentDidMount() {
    this.timer = setTimeout(() => {
      const navbar = document.getElementsByClassName('am-navbar-right')[0].offsetHeight
      const footerBar = document.getElementsByClassName('footer-bar')[0].offsetHeight
      const hei = document.documentElement.clientHeight - footerBar - navbar;
      this.setState({
        height: hei
      });
    }, 600);
  }
  vapidity = (key) => {
    this.props.discovery.changePage(key)
  }
  goSearch = () => {
    //进入搜索页面
    this.props.discovery.changePage(this.state.tabsPage)
    this.props.history.push(path.search.url)
  }
  addPeriodicals = (key) => {
    this.props.discovery.changePage(key)
    this.props.history.push(path.discovery.addPeriodical.url)
  }
  addAuthor = (key) => {
    this.props.discovery.changePage(key)
    this.props.history.push(path.discovery.addAuthor.url)
  }
  addCustom = (key) => {
    //进入添加定制页面
    this.props.discovery.changePage(key)
    this.props.history.push(path.discovery.addCustom.url)
  }
  changeTabs = (tab, index) => {
    this.props.discovery.changePage(index)
    this.setState({ tabsPage: index })
  }
  componentWillUnmount() {
    //离开页面时，初始化数据
    this.timer && clearTimeout(this.timer)
  }
  render() {
    let { height, visible } = this.state,
      { periodicalData, customsAuthor, authorLoading } = this.props.discovery
    const headerOptions = {
      //header相应信息
      text: '关注',
      icon: null,
      onLeftClick: this.goSearch,
      rightContent: [
        <Popover
          mask
          visible={visible}
          overlayClassName="discovery-popover"
          overlayStyle={{ width: '10rem' }}
          overlay={[
            (<div className="popover popover-card">
              <div onClick={this.addCustom.bind(this,0)}><i className="iconfont icon-dingzhi" /></div>
              <div onClick={this.addPeriodicals.bind(this,1)}><i className="iconfont icon-dingzhijisuanjiqun01" /></div>
              <div onClick={this.addAuthor.bind(this,2)}><i className="iconfont icon-user" /></div>
              <div onClick={this.vapidity.bind(this,3)}><i className="iconfont icon-fenlei" /></div>
            </div>),
            (<div className="popover popover-text popover-bottom">
              <div onClick={this.addCustom.bind(this,0)}>定制</div>
              <div onClick={this.addPeriodicals.bind(this,1)}>期刊</div>
              <div onClick={this.addAuthor.bind(this,2)}>作者</div>
              <div onClick={this.vapidity.bind(this,3)}>领域</div>
            </div>),
          ]}
        >
          <i className="iconfont icon-tianjiajiahaowubiankuang" />
        </Popover>
      ],
      leftContent: [
        <i className="iconfont icon-sousuo" />
      ]
    }
    const tabs = [
      { title: '定制' },
      { title: '期刊' },
      { title: '作者' },
      { title: '领域' }
    ]
    return (
      <div className="discovery-page" style={{ height: height }}>
        <NavBar headerOptions={headerOptions} />
        <Tabs
          swipeable={false}
          tabs={tabs}
          onChange={this.changeTabs}
          onTabClick={this.changeTabs}
          initialPage={this.state.initialPage}
          page={this.state.tabsPage}
        >
          <div>
            <Custom />
          </div>
          <div className="periodical">
            <Periodicals/>
          </div>
          <div>
            <Author/>
          </div>
          <div>
            <Fields/>
          </div>
        </Tabs>
      </div>
    )
  }
}
