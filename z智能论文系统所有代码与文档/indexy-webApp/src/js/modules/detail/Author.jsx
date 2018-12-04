/**
 * Created by miffy on 2018/01/12
 */
import React from 'react'
import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import Button from 'antd-mobile/lib/button'
import CellMeasurer from 'react-virtualized/dist/commonjs/CellMeasurer'
import CellMeasurerCache from 'react-virtualized/dist/commonjs/CellMeasurer/CellMeasurerCache'
import InfiniteList from '../../components/InfiniteList'
import Nothing from '../../components/Nothing'
import List from 'antd-mobile/lib/list'
import More from '../../components/More'
import Header from '../../components/Header'

const Item = List.Item;
const Brief = Item.Brief;
const cache = new CellMeasurerCache({
  fixedHeight: false,
  fixedWidth: true
})

@withRouter
@inject("discovery")
@observer
export default class AuthorDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: document.documentElement.clientHeight,
    }
  }
  componentDidMount() {
    let { pathname } = this.props.history.location,
      id = pathname.split('/')[2]
    this.props.discovery.getAuthorDetail(id)
    this.props.discovery.getAuthorList(id)
  }
  componentWillUnmount() {
    //离开页面时，初始化数据
    this.props.discovery.reset()
  }
  goArticlesDetail = (id) => {
    //进入文章详情
    this.props.history.push(`/details/${id}`)
  }
  fetchMore = () => {
    // 获取下一页
    let {listPage} = this.props.discovery,
      page = listPage + 1,
      { pathname } = this.props.history.location,
      id = pathname.split('/')[2]
    this.props.discovery.getAuthorList(id, null, page)
  }
  onCareFor = (e) => {
    let id = e.id,
      method = e.isFollow ? 'DELETE' : 'POST'
    this.props.discovery.followAuthor(id, method)
  }
    renderRow = ( row ) => {
    let {index, style, key, parent} = row,
      {authorList} = this.props.discovery,
      obj = authorList[index]
    return (
      <CellMeasurer cache={cache} key={index} columnIndex={0} rowIndex={index} parent={parent}>
        <div className="authorDetailBG">
          <div className="authorDetailList" key={obj.id} onClick={this.goArticlesDetail.bind(this, obj.id)}>
            <span>{obj.title}</span>
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
    let { authorDetail, articlesLoading } = this.props.discovery
    let headerOptions = {
      icon: null,
      leftContent: [
        <i className="iconfont icon-xiangxia-copy" onClick={this.props.history.goBack} />,
        <span className="header-title"><More text={authorDetail.realname} words={22}/></span>
      ],
      rightContent: [
        <div className="headerBtn">
          <Button className={authorDetail.isFollow ? "cancel-btn" : "subscribe-btn"}
                  onClick={this.onCareFor.bind(this, authorDetail)}>
            {authorDetail.isFollow ? '取消关注' : '十 关注'}
          </Button>
        </div>
      ]
    }
    let { authorList } = this.props.discovery
    return (
      <div className="author-detail">
        <Header headerOptions={headerOptions} />
        <div className="content">
          <div className="title">
            <List>
              <Item extra={<i className="iconfont icon-erweima" />} arrow="horizontal" multipleLine onClick={() => { }}>
                {authorDetail.realname}
                {/*<Brief>博士研究生</Brief>*/}
              </Item>
              <Item className="author-fans">
                粉丝：{authorDetail.fans}  文章：{authorDetail.articleCount}
              </Item>
            </List>
          </div>
          <div className="articals-list">
            <div className="list-header">
              <i className="iconfont icon-jichuxinxi-copy" /><span>论文列表</span>
            </div>
            <InfiniteList
              loading={articlesLoading}
              dataSource={authorList}
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
    )
  }
}
