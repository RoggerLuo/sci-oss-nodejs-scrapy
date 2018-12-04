/**
 * Created by qingkong on 2018/1/8
 */
import React from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import CellMeasurer from 'react-virtualized/dist/commonjs/CellMeasurer'
import CellMeasurerCache from 'react-virtualized/dist/commonjs/CellMeasurer/CellMeasurerCache'
import InfiniteList from '../../components/InfiniteList'
import Nothing from '../../components/Nothing'
import ContentListItem from '../../components/content-list-item/ContentListItem'
import path from '../../app/path'

const cache = new CellMeasurerCache({
  fixedHeight: false,
  fixedWidth: true
})

@withRouter
@inject('discovery')
@observer
export default class Authors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: document.documentElement.clientHeight
    };
  }
  componentDidMount() {
    if(this.props.discovery.customsAuthor.length == 0) {
      this.props.discovery.getCustomAuthors()
    }
    const navbar = document.getElementsByClassName('am-navbar-right')[0].offsetHeight
    const footerBar = document.getElementsByClassName('footer-bar')[0].offsetHeight
    const tabs = document.getElementsByClassName('am-tabs-tab-bar-wrap')[0].offsetHeight
    const hei = document.documentElement.clientHeight - footerBar - navbar - tabs;
    this.timer = setTimeout(() => {
      this.setState({
        height: hei
      });
    }, 600);
  }
  componentWillUnmount() {
    //离开页面时，初始化数据
    this.timer && clearTimeout(this.timer)
    this.props.discovery.reset()
    cache.clearAll()
  }
  goAdd = () => {
    //前往添加作者
    this.props.history.push(path.discovery.addAuthor.url)
  }
  renderRow = (data, row) => {
    let {key, index, style} = row,
      item = data[index]
    return (
      <CellMeasurer
        cache={cache}
        key={index}
        columnIndex={0}
        rowIndex={index}
        parent={parent}>
        <div style={{...style, background: '#fff', borderTop:'10px solid #f7f8f9'}}>
          <ContentListItem type="Authors" item={item} rowID={index}  />
        </div>
      </CellMeasurer>
    )
  }
  fetchMore = () => {
    //获取下一页数据
    let {authorPage, rowsNum} = this.props.discovery,
      {customsAuthor} = this.props.discovery,
      page = authorPage + 1

    if(rowsNum*page <= customsAuthor.length) {
      this.props.discovery.getCustomAuthors(page)
    }
  }

  render() {
    let { height } = this.state,
      { customsAuthor, authorLoading } = this.props.discovery
    return (
      <div className="Authors">
        <InfiniteList
          dataSource={customsAuthor}
          height={height}
          renderRow={this.renderRow.bind(this, customsAuthor)}
          rowHeight={cache.rowHeight}
          loadMore={this.fetchMore}
          noData={() => (<Nothing onClick={this.goAdd}/>)}
          loading={authorLoading}
        />
      </div>
    )
  }
}

