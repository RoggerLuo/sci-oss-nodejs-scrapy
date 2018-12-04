/**
 * Created by miffy on 2017/11/28
 */
import React from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import Icon from 'antd-mobile/lib/icon'
import Button from 'antd-mobile/lib/button'
import CellMeasurer from 'react-virtualized/dist/commonjs/CellMeasurer'
import CellMeasurerCache from 'react-virtualized/dist/commonjs/CellMeasurer/CellMeasurerCache'
import InfiniteList from '../../components/InfiniteList'
import defaultCover from '../../../images/defaultCover.png'
import More from '../../components/More'
import Header from '../../components/Header'
import Nothing from '../../components/Nothing'
import './detail.less'

const cache = new CellMeasurerCache({
  fixedHeight: false,
  fixedWidth: true
})

@withRouter
@inject("discovery")
@observer
export default class periodical extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFollow: props.discovery.periodicalDetail.isFollow || false,
      height: document.documentElement.clientHeight,
      id: null
    }
  }
  componentDidMount() {
    let pathName = this.props.location.pathname,
      pathArray = pathName.split('/'),
      id = pathArray[2]
    this.props.discovery.getPeriodicalDetail(id)
    this.props.discovery.getPeriodicalList(id, null, 0)
    const navbar = document.getElementsByClassName('am-navbar-right')[0].offsetHeight
    const title = document.getElementsByClassName('title')[0].offsetHeight
    const catalog = document.getElementsByClassName('catalog-title')[0].offsetHeight
    const hei = document.documentElement.clientHeight - navbar - title - catalog;
    this.timer = setTimeout(() => {
      this.setState({
        height: hei,
        id: id
      });
    }, 600);
  }
  componentWillUnmount() {
    //离开页面时，初始化数据
    cache.clearAll()
    this.props.discovery.reset()
  }

  goDetail = (id) => {
    this.props.history.push(`/details/${id}`)
  }
  subscribe = () => {
    //判断有无订阅
    // 无则调用POST接口
    // 有则调用DELETE接口
    let pathName = this.props.location.pathname,
      pathArray = pathName.split('/'),
      id = pathArray[2]
    let { periodicalDetail } = this.props.discovery,
      method = periodicalDetail.isFollow ? "DELETE" : "POST"
    this.props.discovery.subscribe(method, id)
  }
  fetchMore = () => {
    // 获取下一页
    let {listPage} = this.props.discovery,
      page = listPage + 1,
      {id} = this.state
    this.props.discovery.getPeriodicalList(id, null, page)
  }
  renderRow = ( row ) => {
    let {index, style, key, parent} = row,
      {articleList} = this.props.discovery,
      obj = articleList[index]
    return (
      <CellMeasurer cache={cache} key={index} columnIndex={0} rowIndex={index} parent={parent}>
      <div className='catalog-data' key={key} style={{...style, "height": "auto", "padding": "10px 0"}} onClick={this.goDetail.bind(this, obj.id)}>
        <div>
          {obj.title}
        </div>
        <div className="authorAndPages" >
          <span className="author">{obj.author}</span>
        </div>
      </div>
      </CellMeasurer>
    )
  }
  noData = () => {
    return (
      <Nothing/>
    )
  }
  render() {
    let { periodicalDetail, articleList, periodicalListLoading} = this.props.discovery
    let headerOptions = {
      icon: null,
      leftContent: [
        <Icon type="left" onClick={this.props.history.goBack} />,
        <span className="header-title">
          <More disable={true} text={periodicalDetail.name} words={12} />
        </span>
      ],
      rightContent: [
        <div className="headerBtn">
          <Button className={periodicalDetail.isFollow ? "cancel-btn" : "subscribe-btn"} onClick={this.subscribe}>{periodicalDetail.isFollow ? '取消订阅' : '十 订阅'}</Button>
        </div>
      ]
    }
    // const tags = ['核心期刊', '统计源期刊']
    return (
      <div className="periodical-detail">
        <Header headerOptions={headerOptions} />
        <div className="content">
          <div className="title">
            <img src={periodicalDetail.img ? periodicalDetail.img : defaultCover}/>
            <div className="text">
              <div className="name">{periodicalDetail.name}</div>
            </div>
          </div>
          <div className="catalog">
            <div className="catalog-title">
              {/*2017年12期*/}
              文章列表
            <span className="icon-wrap"><i className="iconfont icon-xiangxia" /></span>
            </div>
            <div className="catalog-list">
            <InfiniteList
              loading={periodicalListLoading}
              dataSource={articleList}
              renderRow={this.renderRow}
              loadMore={this.fetchMore}
              height={this.state.height}
              rowHeight={cache.rowHeight}
              ref="infinteList"
              noData={this.noData}
              cache={cache}
            />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

