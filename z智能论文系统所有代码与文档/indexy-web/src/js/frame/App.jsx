import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { inject } from 'restackx-core'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { Layout, Menu, Row, Col, Spin, Icon, Link, Radio } from 'antd'
import './app.less'
import path from './path'
//import Logo from '../../images/logo.png'

const {Header, Content, Sider, Footer} = Layout
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const MenuItem = Menu.Item
const SubMenu = Menu.SubMenu

let sidebarWith = 164
let sidebarWith1920 = 256
@withRouter
export default class App extends Component {
  constructor(props) {
    super(props)
    let pathname = props.history.location.pathname
    let defaultSelect = '/tasks'
    if (pathname !=='/index' && pathname !== '/index.html') {
      defaultSelect = pathname
    }
    this.state = {
      selected: defaultSelect,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.history.location.pathname) {
      this.setState({
        selected: nextProps.history.location.pathname,
      })
    }
  }

  render() {
    let {loading, selected, openKeys} = this.state
    return (
      <Layout>
        <Header id="app-header">
          <Row>
            <Col span={4} className="logo-col">
              {/*使用link组件，报错返回的type类型错误，需要string却是undefined*/}
              {/* <Link to="/" className="logo">
                <img className="moria-logo" src={Logo}/>
              </Link>*/}
              <span className="logo">Indexy Dashboard</span>
            </Col>
            <Col span={16} className="right-col">
              <Menu id="app-menu" mode="horizontal">
                <MenuItem><i className="iconfont icon-tongzhi1 moria-icon small-icon"/><span
                  className="menu-text">消息</span></MenuItem>
                <MenuItem><i className="iconfont icon-yaochi moria-icon small-icon"/><span
                  className="menu-text">文档</span></MenuItem>
                <MenuItem>
                  <span className="menu-text">帮助</span>
                </MenuItem>
                <MenuItem>
                  <span className="username">当前用户</span>
                </MenuItem>
              </Menu>
            </Col>
          </Row>
        </Header>
        <Layout>
          <Sider width={sidebarWith} style={{background: '#222e3c'}}>
            <Menu
              mode="inline"
              style={{height: '100%'}}
              className="sider-menu"
              theme="dark"
              defaultOpenKeys={['sub1']}
              // defaultSelectedKeys={this.props.location.pathname ? [this.props.location.pathname] : [path.index.index.url]}
              // defaultSelectedKeys={selected}
              selectedKeys={[selected]}
              onSelect={this.onSelect}
              onOpenChange={this.onOpenChange}
              // openKeys={openKeys}
            >
              <SubMenu
                className="sub-menu"
                key="sub1"
                title={
                  <span>
                    <i className="icon-dianziqikan iconfont"/>
                    <span>任务</span>
                  </span>}
              >
                <MenuItem className="" key={path.tasks.index.url}>任务列表</MenuItem>
                <MenuItem className="" key={path.taskResult.index.url}>任务结果</MenuItem>
              </SubMenu>
              <MenuItem
                className=""
                key={path.thesisManagement.index.url}
              >
                <span>
                  <i className="icon-article iconfont"/>论文管理
                </span>
              </MenuItem>
              <MenuItem
                className=""
                key={path.knowledgeGraph.index.url}>
                <span><i className="icon-qiyetupu iconfont"/>知识图谱</span>
              </MenuItem>
              <MenuItem
                className=""
                key={path.usersManagement.index.url}>
                <span><i className="icon-yonghuguanli iconfont"/>用户管理</span>
              </MenuItem>
              <MenuItem
                className=""
                key={path.authorsManagement.index.url}>
                <span><i className="icon-zuojiaxinxi iconfont"/>作者管理</span>
              </MenuItem>
              <MenuItem
                className=""
                key={path.fieldsManagement.index.url}>
                <span><i className="icon-sj- iconfont"/>领域管理</span>
              </MenuItem>
              <MenuItem
                className=""
                key='/message'>
                <span><i className="icon-xiaoxi iconfont"/>消息</span>
              </MenuItem>
              <MenuItem
                className=""
                key='/system'>
                <span><i className="icon-diannao iconfont"/>系统</span>
              </MenuItem>
            </Menu>
          </Sider>
          <Layout>
            <Content className="root-content">
              {/*{*/}
              {/*// 整个系统都要先获取环境 再加载其他的页面*/}
              {/*loading ?*/}
              {/*<Row type="flex" align="middle" justify="center" className="spin-container">*/}
              {/*<Spin size="large" spinning={true}/>*/}
              {/*</Row>*/}
              {/*:*/}
              {/*this.props.children*/}
              {/*}*/}
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }

  onSelect = (selectMenu) => {
    // console.log('selectMenu', selectMenu)
    if (selectMenu.key.startsWith('/')) {
      this.setState({
        selected: selectMenu.key,
      })
      this.props.history.push(selectMenu.key)
    }
    // let selected = ""
    // menu.map((data, index) => {
    //   if (data.subMenu && data.subMenu.indexOf(selectMenu.key) > -1) {
    //     return selected = data.key
    //   }
    //   else if (data.key === selectMenu.key) {
    //     return selected = selectMenu.key
    //   }
    // })
    // this.setState({selected: selected})
    // this.setState({selected: '/dashboard'})
  }
  onOpenChange = (openKeys) => {
    // let state = this.state,
    //   latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1)),
    //   latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1)),
    //   nextOpenKeys = [];
    // if (latestOpenKey) {
    //   nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    // }
    // if (latestCloseKey) {
    //   nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    // }
    // this.setState({openKeys: nextOpenKeys});
  }

  getAncestorKeys = (key) => {
    const map = {
      sub3: ['sub3'],
    };
    return map[key] || [];
  }
}
