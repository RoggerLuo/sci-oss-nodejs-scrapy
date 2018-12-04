import React from 'react'
import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import Icon from 'antd-mobile/lib/icon'
import CellMeasurer from 'react-virtualized/dist/commonjs/CellMeasurer'
import CellMeasurerCache from 'react-virtualized/dist/commonjs/CellMeasurer/CellMeasurerCache'
import Header from '../../components/Header'
import InfiniteList from '../../components/InfiniteList'
import Nothing from '../../components/Nothing'
import Button from 'antd-mobile/lib/button'
import Modal from 'antd-mobile/lib/modal'

const alert = Modal.alert;

@withRouter
@inject("discovery")
@observer
export default class ResultPage extends React.Component {
  constructor(props) {
    super(props)
    let { pathname } = this.props.history.location,
      id = pathname.split('/')[2]
    this.state = {
      height: document.documentElement.clientHeight,
      id: id
    }
    this.cache = new CellMeasurerCache({
      fixedHeight: false,
      fixedWidth: true
    })

  }
  componentDidMount() {
    this.props.discovery.getTopicsArticlesData(this.state.id)
    // this.props.discovery.getTopicsArticlesData(this.state.id, 1)
    const navbar = document.getElementsByClassName('am-navbar-right')[0].offsetHeight
    const hei = document.documentElement.clientHeight - navbar;
    this.timer = setTimeout(() => {
      this.setState({
        height: hei
      });
    }, 600);
  }
  componentWillUnmount() {
    //离开页面时，初始化数据
    this.cache.clearAll()
    this.props.discovery.reset()
  }
  goDetail = (id) => {
    this.props.history.push(`/details/${id}` )
  }
  renderRow = (row) => {
    let {index, style, key, parent} = row,
      {articlesData} = this.props.discovery,
      obj = articlesData[index]
    return (
      <CellMeasurer cache={this.cache} key={index} columnIndex={0} rowIndex={index} parent={parent}>
        <div className="result-row"
             key={key}
             style={{...style, "height": "auto", "padding": "10px 0" }}
             onClick={this.goDetail.bind(this, obj.id)}>
          <div className="title">
            {obj.title}
          </div>
          <div className="author">
            {obj.author}
          </div>
        </div>
      </CellMeasurer>
    )
  }
  fetchMore = () => {
    //获取下一页数据
    let {page, rowsNum, articlesData} = this.props.discovery,
      {id} = this.state,
      nextPage = page + 1
    if(15*nextPage <= articlesData.length) {
      this.cache.clearAll()
      this.props.discovery.getTopicsArticlesData(id, nextPage)
    }
  }
  noData = () => {
    return (
      <Nothing/>
    )
  }
  del = ( ) => {
    let { pathname } = this.props.history.location,
      id = pathname.split('/')[2]
      this.props.discovery.delCustom(id, this.props.history.goBack)
  }
  clear = () => {
    this.cache.clearAll()
    this.refs.infinteList.recompleteRows()
  }
  render() {
    let {articlesData, topicArticlesLoading} = this.props.discovery,
      {height} = this.state
    const headerOptions = {
      text: '论文列表',
      icon: null,
      onLeftClick: this.props.history.goBack,
      leftContent: [
        <Icon type="left" />
      ],
      rightContent: [
        <div className="headerBtn">
          <Button className="cancel-btn" onClick={() => alert('删除主题定制', '确认要删除该主题吗？', [
            { text: '取消'},
            { text: '确认', onPress: this.del },
          ])}>删除定制</Button>
        </div>
      ]
    }
    return (
      <div className="result-page" style={{height: height}}>
        <Header headerOptions={headerOptions} />
        <div className="content">
          {articlesData.length < 1 && topicArticlesLoading? null:
            <InfiniteList
              dataSource={articlesData}
              height={height}
              renderRow={this.renderRow}
              rowHeight={this.cache.rowHeight}
              loadMore={this.fetchMore}
              cache={this.cache}
              noData={this.noData}
              ref="infinteList"
              loading={topicArticlesLoading}
            />}
        </div>
      </div>
    )
  }
}
