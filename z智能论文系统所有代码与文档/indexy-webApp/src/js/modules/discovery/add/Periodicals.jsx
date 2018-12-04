/**
 * Created by qingkong on 2018/1/9
 */
import React from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import Icon from 'antd-mobile/lib/icon'
import Button from 'antd-mobile/lib/button'
import List from 'antd-mobile/lib/list'
import Picker from 'antd-mobile/lib/picker'
import SearchBar from 'antd-mobile/lib/search-bar'
import Toast from 'antd-mobile/lib/toast'
import NavBar from '../../../components/Header'
import path from '../../../app/path'
import InfinteList from '../../../components/InfiniteList'
import Img from '../../../../images/defaultCover.png'
import Nothing from '../../../components/Nothing'

@withRouter
@inject("discovery")
@observer
export default class Periodical extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchVal: '',
      height: document.documentElement.clientHeight,
      clickedBtn: null,
      selectedRow: {}
    }
  }
  componentDidMount() {
    this.props.discovery.getPeriodicals()
    //计算listview的高度
    const header = document.getElementsByClassName('nav-header')[0].offsetHeight
    const searchBar = document.getElementsByClassName('am-search')[0].offsetHeight
    const picker = document.getElementsByClassName('picker')[0].offsetHeight
    const hei = document.documentElement.clientHeight - header - searchBar - picker;
    this.setState({ height: hei })
  }
  componentWillUnmount() {
    //离开页面时，初始化数据
    this.props.discovery.reset()
  }
  onSearch = (val) => {
    this.setState({ searchVal: val })
    this.props.discovery.getPeriodicals('', val, this.callback)
    this.refs.infinteList.updateList()
  }
  changeValue = (val) => {
    this.setState({ searchVal: val })
  }
  callback = () => {
    //更新listview
    this.refs.infinteList.updateList()
  }
  renderRow = (row) => {
    //渲染listview中的每一栏
    let { periodicals } = this.props.discovery,
      content
    const obj = periodicals[row.index]
    content = obj || { journal: { name: "loading..." } }
    row.isFollowed = content.isFollow
    this.setState({
      clickedBtn: content.journal.id,
      selectedRow: content
    })
    return (
      <div className="add-periodicals" key={row.key} style={row.style}>
        <img
          onClick={this.goDetailPage.bind(this, content)}
          src={content.journal.img ? content.journal.img : Img} alt="" />
        <div className="text" onClick={this.goDetailPage.bind(this, content)}>
          {content.journal.name}
        </div>
        <div className="button">
          <Button
            type={content.isFollow ? 'ghost' : 'primary'} className="primary-btn"
            onClick={this.subscribe.bind(this, content, row)}
          >
            {content.isFollow ? '取消订阅' : '订阅'}
          </Button>
        </div>
      </div>
    )
  }
  subscribe = (obj, row) => {
    //点击订阅或者取消订阅
    let id = obj.journal.id,
      method = obj.isFollow ? 'DELETE' : 'POST'

    this.setState({clickedBtn: id, selectedRow: row})
    this.props.discovery.subscribe(method, id, this.callback)
  }
  subCallback = (id, method, resp) => {
    //点击订阅后的callback
    let pages = this.props.discovery.periodicalsPage + 1,
      {selectedRow} = this.state
    // for(var i=0; i<pages; i++) {
    //   this.props.discovery.getPeriodicals(i)
    // }
    this.refs.infinteList.updateList()
  }
  goDetailPage = (obj) => {
    //进入期刊详情页
    this.props.history.push(path.periodicalDetail.url + `/${obj.journal.id}`)
  }
  fetchMore = () => {
    let {periodicalsPage} = this.props.discovery,
      page = periodicalsPage + 1
    this.props.discovery.getPeriodicals(page)
  }
  noData = () => {
    //当列表没有数据的时候
    return (
      <Nothing/>
    )
  }
  render() {
    let { pickOne, pickTwo, pickThree, periodicals, periodicalLoading } = this.props.discovery
    const headerOptions = {
      //header相应信息
      text: '添加期刊',
      icon: null,
      onLeftClick: this.props.history.goBack,
      rightContent: null,
      leftContent: [
        <Icon key="0" type="left" />
      ]
    }
    return (
      <div className="discovery">
        <NavBar headerOptions={headerOptions} />
        <div className="content">
          <SearchBar
            placeholder="搜索"
            onSubmit={this.onSearch}
            onCancel={this.onSearch.bind(this, '')}
            value={this.state.searchVal}
            onChange={this.changeValue}
          />
          <div className="picker">
            <Picker
              cols={1}
              extra=" "
              title={pickOne}>
              <List.Item>{pickOne}<Icon type="down" /></List.Item>
            </Picker>
            <hr />
            <Picker
              cols={1}
              extra=" "
              className="center"
              title={pickTwo}>
              <List.Item>{pickTwo}<Icon type="down" /></List.Item>
            </Picker>
            <hr />
            <Picker
              cols={1}
              extra=" "
              title={pickThree}>
              <List.Item >{pickThree}<Icon type="down" /></List.Item>
            </Picker>
          </div>
          <InfinteList
            loading={periodicalLoading}
            dataSource={periodicals}
            renderRow={this.renderRow}
            loadMore={this.fetchMore}
            height={this.state.height}
            rowHeight={this.state.height/4}
            noData={this.noData}
            ref="infinteList"
          />
        </div>
      </div>
    )
  }
}
