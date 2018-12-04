import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'

import NavBar from '../../components/Header'
import List from './Recommend'
import path from '../../app/path'
import './home.less'
import weather from '../../../images/home/7@2x.png'

@withRouter
@inject("home")
@observer
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: document.documentElement.clientHeight,
    };
  }
  componentDidMount() {
    if(!this.props.home.recommendData.length > 0) {
      //因后台功能未实现，暂时屏蔽
      //   this.props.home.getRecommendData()
    }
    if (!this.props.home.periodicalData.length > 0) {
      this.props.home.getPeriodicalData()
    }
    if(!this.props.home.selectedFields.length > 0) {
      this.props.home.getFields()
    }
    this.timer = setTimeout(() => {
      const navbar = document.getElementsByClassName('am-navbar-right')[0].offsetHeight
      const footerBar = document.getElementsByClassName('footer-bar')[0].offsetHeight
      const hei = document.documentElement.clientHeight - footerBar - navbar;
      this.setState({
        height: hei,
      });
    }, 600);
  }
  stop() {
    clearInterval(this.interval);
  }
  goSearch = () => {
    this.props.history.push(path.search.url)
  }
  clickMenu = (e) => {
    e.preventDefault(); // Fix event propagation on Android
    this.props.home.changeMenuDisplay()
  }
  changeMenu = (x) => {
    this.props.home.changeMenu(x)
  }
  componentWillUnmount() {
    //离开页面时，初始化数据
    this.timer && clearTimeout(this.timer)
    this.props.home.reset()
  }
  render() {
    let { periodicalData, selectedFields, recommendData,
        indexLoading, recommendLoading } = this.props.home,
      { height } = this.state
    const headerOptions = {
      //navbar相应信息
      text: null,
      icon: null,
      onLeftClick: this.clickMenu,
      rightContent: [
        <i className='iconfont icon-sousuo' onClick={this.goSearch} />
      ],
      leftContent: [
        <span className="NavBar-left" >{selectedFields[0] ? selectedFields[0].name : '暂无领域'}</span>,
      ]
    }
    return (
      <div className="home-page">
        <div className="app">
          <NavBar headerOptions={headerOptions} />
          <div className="tabs-content"
            style={{ height: height, overflow: 'auto' }}>
            <img className="weather" src={weather} />
            <List
              indexLoading={indexLoading}
              recommendLoading={recommendLoading}
              recommendData={recommendData}
              dataSource={periodicalData}
              selectedFields={selectedFields} />
          </div>
        </div>
      </div>
    )
  }
}
