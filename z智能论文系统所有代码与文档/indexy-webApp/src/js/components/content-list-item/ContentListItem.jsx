import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import Icon from 'antd-mobile/lib/icon'
import Popover from 'antd-mobile/lib/popover'
import Button from 'antd-mobile/lib/button'
import Toast from 'antd-mobile/lib/toast'
import Modal from 'antd-mobile/lib/modal'
import Logo from '../Logo'
import More from '../More'
import path from '../../app/path'
import moment from 'moment'
import exchange from '../../components/ConditionExchange'
import Img from '../../../images/defaultCover.png'

const Item = Popover.Item;
const alert = Modal.alert;

@withRouter
@inject("discovery")
@inject("home")
@observer
export default class ContentListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selected: '',
      editVisible: false
    };
  }
  shieldAuthor = (ID) => {
    this.setState({
      visible: false,
    });
  }
  onSelect = (opt) => {
    this.setState({
      visible: false,
      selected: opt.props.value,
    });
  };
  handleVisibleChange = (visible) => {
    this.setState({
      visible,
    });
  };
  vapidity = (id,opt) => {
    const reason = opt.props ? opt.props.value : opt
    this.props.home.userDisincline(id,reason)
    this.setState({ visible: false })
  }
  goDetail = (rowID) => {
    // 直接进入作者详情 再获取数据
    this.props.history.push(path.authorDetail.url+`/${rowID}`)
  }
  goArticlesDetail = (id) => {
    //进入文章详情
    this.props.history.push(`/details/${id}`)
  }
  goPeriodicalDetail = (id) => {
    //进入期刊详情
    this.props.history.push(`/periodicalDetail/${id}`)
  }
  dislike = (id, visible) => {
    //点击卡片的x 显示弹出框
    return <Popover
      mask
      overlayClassName="home-popover"
      visible={visible}
      overlay={[
        (<div className="popover-card"><span>可选理由，精准屏蔽</span><Button onClick={this.vapidity.bind(this,id,"不感兴趣")} type="primary">不感兴趣</Button></div>),
        (<div className="popover-card popover-bottom">
          <Item key="4" value={"看过了"} data-seed="logId">看过了</Item>
          <Item key="2" value={"内容有误"} data-seed="logId" className="fix-button-border">内容有误</Item>
        </div>)
      ]}
      onSelect={this.vapidity.bind(this,id)}
    >
      <div className="dele-icon">
        <Icon type="cross" className="cross-icon" />
      </div>
    </Popover>
  }
  selectEdit = (type, values, opt) => {
    //关注页定制、领域的右上角 点击事件
    let value = opt.props.value ? opt.props.value : ''
    this.setState({ visible: false })
    if (type === "Custom" && value === "edit") {
      this.props.discovery.sendCustomDetail(values)
      this.props.history.push(`/editCustom/${values.id}`)
    }
    if (type === "Custom" && value === "delete") {
      alert('删除主题定制', '确认要删除该主题吗？', [
        { text: '取消', onPress: () => {}},
        { text: '确认', onPress: () => this.props.discovery.delCustom(values.id) },
      ])
    }
  }
  edit = (value, type, visible) => {
    return (
      <Popover
        mask
        overlayClassName="edit-popover"
        visible={visible}
        overlay={[
          (<Item key="4" value="edit" >编辑</Item>),
          (<Item key="5" value="delete" style={{ whiteSpace: 'nowrap' }}>删除</Item>)
        ]}
        onSelect={this.selectEdit.bind(this, type, value)}
      >
        <i className="iconfont icon-iconfontgengduo-copy" />
      </Popover>
    )
  }
  render() {
    const obj = this.props.item
    const rowID = this.props.rowID
    let { type, onClick } = this.props,
      { visible, editVisible } = this.state
    let authors = obj.author ? obj.author.split(";") : [],
      shortAuthors = authors.length > 3 ? authors[0] + ";" + authors[1] + ";" + authors[2] + "..." : authors.join(";")
    if (type === 'fields') {
      return (
        <div className="listview-row" key={rowID} >
          <div className="title">
            <div onClick={onClick}>{obj.title}</div>
            {this.edit(obj, "fields", editVisible)}
          </div>
          <div onClick={onClick} className="amount">文章总数：{obj.amount}</div>
        </div>
      )
    }
    if (type === 'periodical') {
      return (
        <div className="listview-row" key={rowID}>
          <div className="row-title" onClick={this.goArticlesDetail.bind(this, obj.id)}>{obj.title}</div>
          <div className="row-authorTime">
            {
              shortAuthors?
              <span className="row-author" onClick={this.goArticlesDetail.bind(this, obj.id)}>
                <More text={shortAuthors} words={30} />
              </span>
              :
              null
            }
            <span className="row-time" onClick={this.goArticlesDetail.bind(this, obj.id)}>
              {moment(obj.publishTime).format("YYYY[年]MM[月]")}
            </span>
          </div>
          {
            obj.summary?
              <div className="row-abstract" onClick={this.goArticlesDetail.bind(this, obj.id)}>
                <More text={obj.summary} words={50} />
              </div>
              :
              null
          }
          <div className="dislike-pop">
            {this.dislike(obj.id, visible)}
          </div>
        </div>
      )
    }
    if (type === 'author') {
      return (
        <div className="listview-row" key={rowID}>
          <div className="row-name">
            <Logo name={obj.author} />
            {obj.author} </div>
          <div className="row-title">{obj.title}</div>
          <div className="row-keywords">【关键词】：{obj.keywords}</div>
          <div className="dislike-pop">
            {this.dislike(obj.id, visible)}
          </div>
        </div>
      )
    }
    if (type === 'Custom') {
      return (
        <div className="listview-row" key={rowID}  onClick={onClick}>
          <div className="row-title">
            <div>{obj.name}</div>
            <i className="iconfont icon-iconfontgengduo-copy"/>
          </div>
          <div className="row-time">创建日期：{moment(obj.created_at).format("YYYY[年]MM[月] H:mm:ss")}</div>
          <div className="row-abstract" onClick={onClick}>
            <div className="content">
              <div className="triangle" />
              {
                obj.titleText?
                  <div className="name">篇名：{obj.titleText}<span>({exchange(obj.titleOper)})</span></div>
                  :
                  null
              }
              {
                obj.keywordText?
                  <div className="name">关键字：{obj.keywordText}<span>({exchange(obj.keywordOper)})</span></div>
                  :
                  null
              }
              {
                obj.abstractText?
                  <div className="name">摘要：{obj.abstractText}</div>
                  :
                  null
              }
            </div>
          </div>
        </div>
      )
    }
    if (type === 'Authors') {
      return (
        <div className="listview-row" key={rowID} style={{marginTop:'10px'}}>
          <div className="row-title" onClick={this.goDetail.bind(this, obj.id)}>
            {obj.realname}
          </div>
          <div className="detail">
            <div className="fans">粉丝：{obj.fans}</div>
            <div className="amount">发表文章数：{obj.articleCount}</div>
          </div>
          <div className="row-abstract">
            <div className="content">
              <div className="triangle" />
              {
                obj.latestArticle ? <div className="news">
                  <div className="news-header">最新动态：</div>
                  {/* {moment(obj.publishTime).format("YYYY[年]MM[月]")} */}
                  <div className="time">{moment(obj.latestArticle.publishTime).format("YYYY[-]MM[-]DD")}</div>
                  <div className="action">发表文章<u onClick={this.goArticlesDetail.bind(this, obj.latestArticle.id)}>《{obj.latestArticle.title}》</u></div>
                </div> : <div className="not-news">暂无动态</div>
              }
            </div>
          </div>
        </div>
      )
    }
    if (type === 'searchAuthors') {
      return (
        <div className="listview-row" key={rowID} onClick={this.goDetail.bind(this, obj.id)}>
          <div className="row-title" >
            {obj.realname}
          </div>
          <div className="detail">
            <div className="fans">粉丝：{obj.fans}</div>
            <div className="amount">发表文章数：{obj.articleCount}</div>
          </div>
        </div>
      )
    }
    if (type === 'searchPeriodicals') {
      return (
        <div className="listview-row" key={rowID} onClick={this.goPeriodicalDetail.bind(this, obj.journal.id)}>
          <img src={Img} />
          <div className="detail">
            <div className="row-title" >{obj.journal.name}</div>
            <span className="row-tag" >{obj.journal.type}</span>
          </div>
        </div>
      )
    }
  }
}
