//选择二级感兴趣领域 暂时隐藏

import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import Icon from 'antd-mobile/lib/icon'
import SearchBar from 'antd-mobile/lib/search-bar'
import Button from 'antd-mobile/lib/button'

import './subdvision.less'
import path from '../../app/path'
import Logo from '../../components/Logo'
import NavBar from '../../components/Header'

@withRouter
@inject("discovery")
@observer
export default class Subdivision extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: [],
      tabChoosed: '',
    }
  }
  componentDidMount() {
    let { pathname } = this.props.history.location,
      id = pathname.split('/')[3]
    this.props.discovery.getSecondFields(id)
    this.props.discovery.getDetail(id)
  }
  componentWillUnmount() {
    this.props.discovery.reset()
  }
  goHome = () => {
    this.props.history.push(path.home.url)
  }
  sendFields = () => {
    //判断有无选择第三级领域，若无 则判断有误选择第二级领域，若无 则获取第一级的id
    let ids = [],
    {selected, tabChoosed} = this.state
    ids.push(...selected)
    if (selected.length<1 && tabChoosed) {
      //没有选择第三级领域，选择了第二级领域
      ids.push(tabChoosed)
    }
    else if(selected.length<1 && !tabChoosed) {
      //没有选择第三级和第二级领域 则选择第一级领域
      let pathname =  this.props.history.location.pathname,
      pathArray = pathname.split('/')
      ids.push(pathArray[3])
    }
    this.props.discovery.sendFields(ids, this.goHome)
  }
  doJump = () => {
    this.props.history.push(path.home.url)
  }
  handleBtnSelected = (id, type) => {
    const selected = this.state[type]
    if (this.state[type].indexOf(id) === -1) {
      let newSelected = [...selected, id]
      this.setState({
        [type]: newSelected,
      }, () => {})
    } else {
      const copeSelected = [...selected]
      let i = this.state[type].indexOf(id)
      copeSelected.splice(i, 1)
      this.setState({
        [type]: copeSelected,
      }, () => console.log('selected id', this.state[type]))
    }
  }
  handleBtnChoose = (id) => {
    this.props.discovery.getThirdFields(id)
    this.setState({
      tabChoosed: id,
    })
  }
  doSearch = (txt) => {
    // console.log('搜索内容', txt)
  }
  render() {
    let { secondFields, thirdFields, fieldDetail } = this.props.discovery
    const headerOptions = {
      rightContent: <span key="1" className="nav-jump" onClick={this.doJump}>跳过</span>,
      text: 'Indexy',
      icon: <Icon size="md" type="left" />,
      onLeftClick: this.props.history.goBack,
    }
    const tabData = secondFields ? secondFields : []
    const data = thirdFields ? thirdFields : []
    return (
      <div className="subdivision">
        <NavBar headerOptions={headerOptions} />
        <div className="media">
          <div className="media-left">
            <Logo className="media-object" name={fieldDetail.name ? fieldDetail.name : ''} />
          </div>
          <div className="media-body">
            <h4>{fieldDetail ? fieldDetail.name : ''}
              <small>请选择具体类型（可多选）</small>
            </h4>
            <SearchBar
              placeholder="搜索类型"
              onSubmit={this.doSearch}
            />
          </div>
        </div>
        <div className="cls-one cls">
          {
            tabData.map((item, i) => {
              return (
                <Button
                  key={item.id}
                  onClick={this.handleBtnChoose.bind(this, item.id)}
                  type="default"
                  className={'ibtn ' + ((this.state.tabChoosed === item.id) ? 'is-active' : '')}
                  inline>{item.name}</Button>
              )
            })
          }
        </div>
        {/* <div className="cls-two cls">
          {
            data.map(item => {
              return (
                <Button
                  key={item.id}
                  onClick={this.handleBtnSelected.bind(this, item.id, 'selected')}
                  type="default"
                  className={'ibtn ibtn-ghost ' + (this.state.selected.indexOf(item.id) === -1 ? '' : 'is-active')}
                  inline>{item.name}</Button>
              )
            })
          }
        </div> */}
        <Button type="primary" className="ibtn ibtn-gohome" onClick={this.sendFields}>
          进入首页 > </Button>
      </div>
    )
  }
}
