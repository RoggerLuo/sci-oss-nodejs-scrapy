/**
 * Created by qingkong on 2018/1/9
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import Icon from 'antd-mobile/lib/icon'
import Menu from 'antd-mobile/lib/menu'
import Button from 'antd-mobile/lib/button'
import List from 'antd-mobile/lib/list'
import Picker from 'antd-mobile/lib/picker'
import SearchBar from 'antd-mobile/lib/search-bar'
import NavBar from '../../../components/Header'
import path from '../../../app/path'
import InfinteList from '../../../components/InfiniteList'
import Nothing from '../../../components/Nothing'

@withRouter
@inject("discovery")
@observer
export default class Author extends React.Component {

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
    this.props.discovery.getAuthorData()
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
  onChange = (index) => {
    this.props.discovery.changeTab(index);
  }
  componentWillUnmount() {
    //离开页面时，初始化数据
    this.props.discovery.reset()
  }
  onSearch = (val) => {
    this.setState({ searchVal: val })
    this.props.discovery.getAuthorData('', val, this.callback)
    this.refs.infinteList.updateList()
  }
  changeValue = (val) => {
    this.setState({ searchVal: val })
  }
  goDetail = (id) => {
    //前往作者详情页面
    this.props.history.push(path.authorDetail.url + `/${id}`)
  }
  onCareFor = (e, row) => {
    //点击订阅
    let id = e.id,
      method = e.isFollow ? 'DELETE' : 'POST'
    this.setState({clickedBtn: id, selectedRow: row})
    this.props.discovery.followAuthor(id, method, this.callback)
  }
  callback = () => {
    //更新listview
    this.refs.infinteList.updateList()
  }
  fetchMore = () => {
    let {authorPage} = this.props.discovery,
      {searchVal} = this.state,
      page = authorPage + 1
    this.props.discovery.getAuthorData(page, searchVal)
  }
  noData = () => {
    return (
      <Nothing/>
    )
  }
  renderRow = (row) => {
    //渲染listview中的每一栏
    let {author} = this.props.discovery,
      {index, key, style} = row
    const obj = author[index]
    return (
      <div className="discovery-body" key={key} style={style}>
        <div className="discovery-title">
          <div className="discovery-icon" onClick={this.goDetail.bind(this, obj.id)}>
            <div className="discovery-abstract" style={{width: '100%'}}>
              <span>
              {obj.realname}
              </span>
              <div className="discovery-remark">粉丝：{obj.fans}&nbsp;&nbsp;&nbsp;&nbsp;发表文章数：{obj.articleCount}</div>
            </div>
          </div>
          <Button onClick={this.onCareFor.bind(this, obj, row)} type={obj.isFollow ? 'ghost' : 'primary'} className="list-btn primary-btn">
            {obj.isFollow ? '取消关注' : '关注'}
          </Button>
        </div>
      </div>
    )
  }
  render() {
    let { pickOne, pickTwo, pickThree, author, authorState, authorLoading } = this.props.discovery
    const headerOptions = {
      //header相应信息
      text: '添加作者',
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
              // data={dataOne}
              title={pickOne}>
              <List.Item>{pickOne}<Icon type="down" /></List.Item>
            </Picker>
            <Picker
              cols={1}
              extra=" "
              // data={dataTwo}
              title={pickTwo}>
              <List.Item>{pickTwo}<Icon type="down" /></List.Item>
            </Picker>
            <Picker
              cols={1}
              extra=" "
              // data={dataThree}
              title={pickThree}>
              <List.Item>{pickThree}<Icon type="down" /></List.Item>
            </Picker>
          </div>
          <InfinteList
            loading={authorLoading}
            dataSource={author}
            renderRow={this.renderRow}
            loadMore={this.fetchMore}
            height={this.state.height}
            rowHeight={this.state.height/7}
            noData={this.noData}
            ref="infinteList"
          />
        </div>
      </div>
    )
  }
}
