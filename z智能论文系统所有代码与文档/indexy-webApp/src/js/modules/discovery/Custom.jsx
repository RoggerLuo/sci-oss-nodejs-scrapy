/**
 * Created by qingkong on 2018/1/5
 */
import React from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import SwipeAction from 'antd-mobile/lib/swipe-action'
import Modal from 'antd-mobile/lib/modal'
import CellMeasurer from 'react-virtualized/dist/commonjs/CellMeasurer'
import CellMeasurerCache from 'react-virtualized/dist/commonjs/CellMeasurer/CellMeasurerCache'
import ContentListItem from '../../components/content-list-item/ContentListItem'
import InfiniteList from '../../components/InfiniteList'
import path from '../../app/path'
import Nothing from '../../components/Nothing'

const alert = Modal.alert;
const cache = new CellMeasurerCache({
  fixedHeight: false,
  fixWidth: true
})
@withRouter
@inject('discovery')
@observer
export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: document.documentElement.clientHeight
    };
  }
  componentDidMount() {
    if(this.props.discovery.customList.length==0) {
      this.props.discovery.getCustom()
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
    cache.clearAll()
    this.timer && clearTimeout(this.timer)
  }
  goResult = (id) => {
    this.props.history.push(`/result/${id}`)
  }
  goAddCustom = () => {
    this.props.history.push(path.discovery.addCustom.url)
  }
  selectEdit = (type, values) => {
    //关注页定制、领域的右上角 点击事件
    this.setState({ visible: false })
    let name = values.name
    let data = [
      {
        type: 'keyword',
        exact: values.keywordExact,
        condi: values.keywordOper,
        value: values.keywordText
      }, {
        type: 'title',
        exact: values.titleExact,
        condi: values.titleOper,
        value: values.titleText
      }, {
        type: 'abstract',
        exact: values.abstractExact,
        condi: values.abstractOper,
        value: values.abstractText
      }
    ]
    if (type === "edit") {
      this.props.discovery.sendCustomDetail(data,name)
      this.props.history.push(`/editCustom/${values.id}`)
    }
    if (type === "delete") {
      this.props.discovery.delCustom(values)
    }
  }
  renderRow = (data, row) => {
    let {index, style, key, parent} = row
    let obj = data[index]
    return (
      <CellMeasurer cache={cache} key={index} columnIndex={0} rowIndex={index} parent={parent}>
        <div key={key} style={{...style, borderTop:'10px solid #f7f8f9'}} >
          <SwipeAction
            key={index}
            style={{ backgroundColor: 'gray' }}
            autoClose
            right={[
            {
              text: '编辑',
              onPress: this.selectEdit.bind(this, 'edit', obj),
              style: { backgroundColor: '#6da7ff', color: '#ffffff', width: '2rem', height: '50%' },
            },
            {
              text: '删除',
              onPress: () => alert('删除主题定制', '确认要删除该主题吗？', [
              { text: '取消'},
              { text: '确认', onPress: this.selectEdit.bind(this, 'delete', obj.id) },
            ]),
              style: { backgroundColor: '#CCCCCC', color: '#ffffff', width: '2rem', height: '50%' },
            },
            ]}
            >
            <ContentListItem type="Custom" item={obj} rowID={obj.id}  onClick={this.goResult.bind(this,obj.id)}/>
          </SwipeAction>
        </div>
      </CellMeasurer>
    )
  }

  noData = () => {
    return (
      <Nothing onClick={this.goAddCustom}/>
    )
  }

  fetchMore = () => {
    //获取下一页数据
    let {customPage, rowsNum, customList} = this.props.discovery,
      page = customPage + 1
    if(rowsNum*page <= customList.length) {
      this.props.discovery.getCustom(page)
    }
  }

  render() {
    let { height } = this.state,
      { customList, customLoading } = this.props.discovery,
      data = []
    customList && customList.forEach((item) => {
      let obj = {
        abstractText: item.abstract.content ? item.abstract.content : '',
        abstractOper: item.abstract ? item.abstract.operator : '',
        abstractExact: item.abstract ? item.abstract.exact : '',
        created_at: item.created_at ? item.created_at : '',
        id: item.id ? item.id : '',
        name: item.name ? item.name : '',
        titleText: item.title ? item.title.content : '',
        titleOper: item.title ? item.title.operator : '',
        titleExact: item.title ? item.title.exact : '',
        keywordText: item.keyword ? item.keyword.content : '',
        keywordOper: item.keyword ? item.keyword.operator : '',
        keywordExact: item.keyword ? item.keyword.exact : '',
        updated_at: item.updated_at ? item.updated_at : '',
        userId: item.userId ? item.userId : ''
      }
      data.push(obj)
    })
    return (
      <div className="Custom" style={{ height: height }}>
        <InfiniteList
          noData={this.noData}
          dataSource={data}
          height={height}
          renderRow={this.renderRow.bind(this, data)}
          rowHeight={cache.rowHeight}
          loadMore={this.fetchMore}
          loading={customLoading}
        />
      </div>
    )
  }
}

