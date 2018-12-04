/**
 * Created by qingkong on 2017/11/16
 */
import React from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import Icon from 'antd-mobile/lib/icon'
import Button from 'antd-mobile/lib/button'
import List from 'antd-mobile/lib/list'
import NavBar from '../../components/Header'
import Popover from 'antd-mobile/lib/popover'
import Accordion from 'antd-mobile/lib/accordion'
import InputItem from 'antd-mobile/lib/input-item'
import CellMeasurer from 'react-virtualized/dist/commonjs/CellMeasurer'
import CellMeasurerCache from 'react-virtualized/dist/commonjs/CellMeasurer/CellMeasurerCache'
import InfiniteList from '../../components/InfiniteList'
import './work.less'
import { createForm } from 'rc-form';
import More from '../../components/More'

const Item = List.Item;
const cache = new CellMeasurerCache({
  fixedHeight: false,
  fixedWidth: true
})
@withRouter
@inject('work')
@inject('home')
@inject('label')
@observer
class Work extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: document.documentElement.clientHeight,
      visible: false,
      selectKey: '',
      selectStatus: '',
      selectLabel: '',
      inputVisible: false,
      note: '',
      status: '',
      collection: '',
      type: ''
    };
  }
  componentDidMount() {
    let { selectStatus, selectLabel } = this.state
    if(this.props.work.starArticles.length == 0) {
      this.props.work.getStarArticles(selectStatus,selectLabel)
    }
    if(this.props.label.label.length == 0) {
      this.props.label.getLabel()
    }
    const sort = document.getElementsByClassName('sort')[0].offsetHeight
    const app = document.getElementsByClassName('nav-header')[0].offsetHeight
    const footerBar = document.getElementsByClassName('footer-bar')[0].offsetHeight
    const listHeader = document.getElementsByClassName('list-header')[0].offsetHeight
    const hei = document.documentElement.clientHeight - app - footerBar - sort - listHeader
    this.timer = setTimeout(() => {
      this.setState({
        height: hei,
      });
    }, 600);
  }
  componentWillUnmount() {
    //离开页面时，初始化数据
    cache.clearAll()
  }
  inputChange = (type,e) => {
    switch (type){
      case 'note':
        this.setState({ note: e })
        break;
      case 'status':
        this.setState({ status: e })
        break;
      case 'collection':
        this.setState({ collection: e })
        break
    }
  }
  add = (type,e) => {
    this.props.form.validateFields((error,values)=>{
      switch (type){
        case 'note':
          if(!error){
            // this.props.home.add(type,e.note)
          }
          break;
        case 'status':
          if(!error){
            // this.props.home.add(type,e.status)
          }
          break;
        case 'collection':
          if(!error){
            this.props.label.addLabel(e.collection,this.onStatusChange)
          }
          break;
      }
      this.props.form.resetFields()
    })
  }
  close = () => {
    //选择了分类筛选后 关闭分类筛选弹出框
    let { visible, type, selectKey, selectStatus, selectLabel } = this.state
    this.props.work.getStarArticles(selectStatus, selectLabel, 0)
    this.setState({
      visible: !visible
    })
  }
  handleVisibleChange = (visible) => {
    this.setState({
      visible: visible,
      inputVisible: false,
    });
    this.props.form.resetFields()
  };
  onChange = (key) => {
    this.setState({
      // selectKey: '',
      inputVisible: false,
      note: '',
      status: '',
      collection: '',
      // type: ''
    })
    this.props.form.resetFields()
  }
  onSelect = (key,type) => {
    switch (type) {
      case 'selectKey':
        if(this.state.selectKey === key){
          this.setState({
            selectKey: '',
          })
        }else {
          this.setState({
            selectKey: key,
          })
        }
        break;
      case 'selectStatus':
        if(this.state.selectStatus === key){
          this.setState({
            selectStatus: '',
          })
        }else {
          this.setState({
            selectStatus: key,
          })
        }
        break;
      case 'selectLabel':
        if(this.state.selectLabel === key){
          this.setState({
            selectLabel: '',
          })
        }else {
          this.setState({
            selectLabel: key,
          })
        }
        break;
    }
    cache.clearAll()
  }
  onStatusChange = () => {
    let inputVisible = this.state.inputVisible
    this.setState({
      inputVisible: !inputVisible,
      note: '',
      status: '',
      collection: '',
    })
    this.props.form.resetFields()
  }
  goArticlesDetail = (id) => {
    //进入文章详情
    this.props.history.push(`/details/${id}`)
  }
  dislike = (e, selectKey,type) => {
    cache.clearAll()
    return e.map((item, index) => {
      return (
        <List.Item
          key={index}
          onClick={this.onSelect.bind(this, item.id, type)}
          style={{ backgroundColor: selectKey === item.id ? '#4c4c4c' : '' }}
        >
          <div
            style={{
              color: selectKey === item.id ? '#fff' : '',
              backgroundColor: selectKey === item.id ? '#4c4c4c' : ''
            }}
          >{item.name}</div>
        </List.Item>
      )
    })
  }
  input = (type,inputVisible) => {
    const { getFieldDecorator } = this.props.form;
    return(
      <div
        className="popover-input"
        style={{ display : inputVisible ? 'flex' : 'none' }}
      >
        {getFieldDecorator(type, {
          initialValue: '',
          rules: [{
            required: true,
            message: '不能为空'
          }],
        })(
          <InputItem
            placeholder="请输入内容"
            onChange={this.inputChange.bind(this,type)}
          />
        )}
        <Button type="primary" onClick={this.add.bind(this,type,this.state)}>添加</Button>
      </div>
    )
  }
  componentWillUnmount() {
    //离开页面时，初始化数据
    this.timer && clearTimeout(this.timer)
    this.props.form.resetFields()
    this.setState({
      visible: false,
      inputVisible: false,
    });
  }
  renderRow = (data, row) => {
    let {style, key, index, parent} = row
    const item = data[index]
    return (
      <CellMeasurer cache={cache} key={index} columnIndex={0} rowIndex={index} parent={parent}>
        <div className="list-row" style={{...style, height: "auto" ,"padding": '10px 0'}} key={key}>
          <div
          className="list-title"
          onClick={this.goArticlesDetail.bind(this,item.id)}
          >
            <More text={item.title} words={50} />
          </div>
          <div className="list-keyword">
            <div className="list-before">
              <i className="iconfont icon-7yuyuedingdanwudingdan-copy" />
              <span>暂无笔记</span>
              <span style={{color : item.status=='read'?'#f5bd52':'#6da7ff'}}>{item.status=='read'?'已读':'未读'}</span>
            </div>
            <div>
              {
              item.labelIds.length > 0 ?
              <li className="list-after">{item.labelIds[0]}</li>
              :
              <li className="list-after">暂无分类</li>
              }
            </div>
          </div>
        </div>
      </CellMeasurer>
    )
  }
  fetchMore = () => {
    //获取下一页
    let {page, rowsNum, starArticles} = this.props.work,
      {selectStatus, selectLabel} = this.state,
      nextPage = page + 1
    if(nextPage * rowsNum <= starArticles.length) {
      this.props.work.getStarArticles(selectStatus, selectLabel, nextPage)
    }
  }
  render() {
    let { visible, selectKey, inputVisible, selectStatus, selectLabel } = this.state
    let { label } = this.props.label
    let { selectedMenu, menuShow, collection, note, status, starArticles, indexLoading } = this.props.work
    const headerOptions = {
      //navbar相应信息
      text: '工作',
      icon: null,
      onLeftClick: null,
      rightContent: null,
    }
    const popoverHeight = this.state.height - 30
    let PerData = []
    starArticles.forEach(item => {
      let obj = {}
      if(item.labelIds&&item.labelIds.indexOf(",")>-1) {
        //用分号间隔
        obj = {
          title: item.title,
          status: item.status,
          id: item.id,
          labelIds: item.labelIds.split(",")
        }
      }else {
        obj = {
          title: item.title,
          status: item.status,
          id: item.id,
          labelIds: [item.labelIds]
        }
      }
      PerData.push(obj)
    })
    PerData.forEach(item => {
      let obj = []
      item.labelIds.forEach(ids => {
        label.forEach(labels =>{
          labels.id==ids?obj.push(labels.name):''
        })
      })
      item.labelIds = obj
    })
    return (
      <div className="Work" ref={el => this.lv = el}>
        <NavBar headerOptions={headerOptions} />
        <Popover
          visible={visible}
          overlayClassName="Work-popover"
          overlayStyle={{ height: popoverHeight }}
          overlay={[
            (<div className="card">
              <Accordion accordion className="my-accordion" onChange={this.onChange}>
                <Accordion.Panel
                  header={<div className="panel-heard">
                    <span>阅读状态</span><span className="popover-span">全部</span>
                  </div>}
                >
                  <List className="my-list">
                    {
                      status.length > 0 ? this.dislike(status,selectStatus,'selectStatus') : null
                    }
                  </List>
                </Accordion.Panel>
                <Accordion.Panel
                  header={<div className="panel-heard">
                    <span>阅读笔记</span><span className="popover-span">全部</span>
                  </div>}
                >
                  <List className="my-list">
                    {
                      note.length > 0 ? this.dislike(note,selectKey,'selectKey') : null
                    }
                  </List>
                </Accordion.Panel>
                <Accordion.Panel
                  header={<div className="panel-heard">
                    <span>收藏分类</span><span className="popover-span">管理</span>
                  </div>}
                >
                  <List className="my-list">
                    {
                      label.length > 0 ? this.dislike(label,selectLabel,'selectLabel') : null
                    }
                    <List.Item
                      onClick={this.onStatusChange}
                      style={{ backgroundColor : '#fff' }}
                    >
                      <Icon type="plus" style={{ color : "#999" }}/>
                    </List.Item>
                  </List>
                  {
                    this.input('collection',inputVisible)
                  }
                </Accordion.Panel>
              </Accordion>
            </div>),
            (<div className="popover-card"><Button onClick={this.close} type="primary">确定</Button></div>),
          ]}
          onVisibleChange={this.handleVisibleChange}
        >
          <div className="sort" style={{ color: visible ? "#6da7ff" : "#333" }}>分类筛选<Icon type="down" /></div>
        </Popover>
        <div className="content" >
          <div className="list">
            <div className="list-header">
              <i className="iconfont icon-jichuxinxi-copy" /><span>论文列表</span>
            </div>
            <div className="list-content">
              <InfiniteList
                loading={indexLoading}
                dataSource={PerData}
                renderRow={this.renderRow.bind(this, PerData)}
                loadMore={this.fetchMore}
                ref="infinteList"
                height={this.state.height}
                rowHeight={cache.rowHeight}
                cache={cache}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const WorkWrapper = createForm()(Work);
export default WorkWrapper;
