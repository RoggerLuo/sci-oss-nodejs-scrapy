/**
 * Created by qingkong on 2017/9/5
 */
import React from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import Button from 'antd-mobile/lib/button'
import Popover from 'antd-mobile/lib/popover'
import List from 'antd-mobile/lib/list'
import moment from 'moment'
import More from '../../components/More'
import path from '../../app/path'
import Toast from 'antd-mobile/lib/toast'
import ActivityIndicator from 'antd-mobile/lib/activity-indicator'
import { createForm } from 'rc-form';
import api from '../discovery/api'
import { getCookie } from '../../utils/cookies'
import { isIOS } from '../../utils'

import NavBar from '../../components/Header'
import Img from '../../../images/defaultCover.png'
const Item = List.Item;


Array.prototype.contains = function (needle) {
  for (let i in this) {
    if (this[i] == needle) return true;
  }
  return false;
}

@withRouter
@inject("discovery")
@inject("home")
@inject("work")
@inject("label")
@observer
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      inputVisible: false,
      collect: '',
      selectKey: '',
      selectKeys: [],
      visible: false,
      status: false,
      authorLoading: false,
    };
  }
  componentDidMount() {
    let { pathname } = this.props.history.location,
      id = pathname.split('/')[2]
    this.props.home.getArticle(id)
    this.props.label.getLabel()
    this.props.home.getPeriodicalData()
  }
  componentDidUpdate() {

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
  add = (type, e) => {
    this.props.form.validateFields((error, values) => {
      if (!error) {
        this.props.home.add(type, e)
        this.props.form.resetFields()
      }
    })
  }
  getRandomColor = () => {
    //生成随机的色号
    let color = (Math.random() * 0xffffff << 0).toString(16)
    if (color.length < 6) {
      color = '6da7ff'
    }
    return '#' + color;
  }
  getAuthorDetail(e) {
    this.setState({ authorLoading: true })
    this.props.discovery.getAuthorId(e, this.goAuthorDetail)
  }
  goAuthorDetail = (id) => {
    // 跳转作者详情页面
    if(id) {
      this.props.history.push(path.authorDetail.url + `/${id}`)
    }
    else {
      Toast.fail('暂时无法获取该作者详情')
    }
  }
  goPeriodicalDetail = (id) => {
    //进入期刊详情页面
    this.props.history.push(path.periodicalDetail.url + `/${id}`)
  }
  delCollect = (id) => {
    this.props.home.delCollect(id)
  }
  showModal = (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      modal: true,
    });
  }
  onClose = () => {
    this.setState({
      modal: false,
      selectKey: '',
      selectKeys: []
    });
  }
  goDetail = (id) => {
    this.props.home.reset()
    this.props.home.getArticle(id)
    this.props.home.getPeriodicalData()
    this.props.history.push(`/details/${id}`)
  }
  goRead = (id) => {
    if(isIOS){
      const { articleDetail } = this.props.home
      window.open(api.pdfUrl(articleDetail.pdfUrl))
      // this.down(id)
    }else{
      this.props.history.push(`/read/${id}`)
    }
  }
  loadAll = (id) => {
    this.props.discovery.loadingAll(id)
    this.setState({ status: true })
  }
  down = (id, event) => {
    const isDownload = !!event
    let uid = getCookie('userID')
    var elemIF = document.createElement("iframe");
    elemIF.src = api.pdf(uid,id,isDownload);
    elemIF.style.display = "none";
    document.body.appendChild(elemIF);
  }
  onSelectPopover = () => {
    let { pathname } = this.props.history.location,
      id = pathname.split('/')[2]
    let { articleDetail } = this.props.home
    this.props.home.sendArticleDetail(articleDetail)
    this.props.history.push(`/classification/${id}`)
  }
  goBack = () => {
    this.props.discovery.reset()
    this.props.home.reset()
    this.props.history.goBack()
  }
  render() {
    let { isAuth } = this.props.discovery,
      { articleDetail, detailLoading, periodicalData, label } = this.props.home,
      { inputVisible, selectKey, selectKeys, status, authorLoading } = this.state,
      authorArr = []
    const headerOptions = {
      rightContent: [
        articleDetail.isCollection?
          <Popover mask
            overlayClassName="details-popover"
            overlayStyle={{ color: 'currentColor' }}
            visible={this.state.visible}
            overlay={[
              (<Item key="4" onClick={this.onSelectPopover}>论文分类</Item>),
            ]}
            align={{
              overflow: { adjustY: 0, adjustX: 0 },
              offset: [-10, 0],
            }}>
          <div style={{
            height: '100%',
            padding: '0 15px',
            marginRight: '-15px',
            display: 'flex',
            alignItems: 'center',
          }}
          >
            <i className="iconfont icon-iconfontgengduo" />
          </div>
        </Popover>:
          null
      ],
      text: null,
      leftContent: [
        <i className="iconfont icon-xiangxia-copy" onClick={this.goBack} />,
        <span>详情</span>
      ]
    }
    //TODO:还有一种情况是只有一个作者
    //此处作者可能会存在两种情况、一种是用分号间隔 一种是用逗号分隔
    if(articleDetail.author&&articleDetail.author.indexOf(";")>-1) {
      //用分号间隔
      authorArr = articleDetail.author.split(";")
    }
    if(articleDetail.author&&articleDetail.author.indexOf(",")>-1) {
      //用逗号间隔
      authorArr = articleDetail.author.split(",")
    }
    if(articleDetail.author&&articleDetail.author.indexOf(" ")>-1) {
      //作者名含空格符

    }
    if(!(articleDetail.author&&articleDetail.author.indexOf(";")>-1) &&
      !(articleDetail.author&&articleDetail.author.indexOf(",")>-1)) {
      authorArr.push(articleDetail.author)
    }
    authorArr = authorArr.filter(function (n) { return n })
    const { getFieldDecorator } = this.props.form;
    let periodical = periodicalData ? periodicalData.slice(0, 3) : []
    return (
      <div className="article-detail" ref={el => this.lv = el}>
        <NavBar headerOptions={headerOptions} />
        <div className="container">
          {
            articleDetail.title ?
              <div className="brief">
                <div className="title">{articleDetail.title}</div>
                <div className="time">发表时间：{moment(articleDetail.created_at).format("YYYY-MM-DD")}</div>
                <div className="download-count">下载量：{articleDetail.downloadCount}&nbsp;&nbsp;&nbsp;</div>
                <div className="buttons">
                  {articleDetail.isCollection?
                    <Button className="star-btn" onClick={this.delCollect.bind(this,articleDetail.id)}>取消收藏</Button>:
                    <Button className="star-btn" onClick={this.onSelectPopover}>收藏</Button>}
                    <Button className="read-btn" disabled={!articleDetail.pdfUrl}
                          onClick={this.goRead.bind(this,articleDetail.id)}>阅读</Button>
                  {
                    articleDetail.pdfUrl?
                      <Button onClick={this.down.bind(this,articleDetail.id)} className="download-btn">下载全文</Button>
                      :
                      <Button disabled={articleDetail.pdfUrl ? false : status} onClick={this.loadAll.bind(this,articleDetail.id)} className="download-btn">请求全文</Button>
                  }
                </div>
              </div>
              :
              <div className="loading">
                <ActivityIndicator text="Loading..."/>
              </div>
          }
          {
            articleDetail.author ?
              <div className="content">
                <div className="header"><i className="iconfont icon-shuji3" />文献详情</div>
                <div className="author">作者：
                  {
                    authorArr.length > 0
                      ?
                      authorArr.map((author, index) => {
                        return  <span key={index} onClick={this.getAuthorDetail.bind(this, author)}>{author+' '}</span>
                      })
                      : <span>暂无作者</span>
                  }
                </div>
                <div className="abstract">摘要：<More text={articleDetail.summary} words={100} /></div>
                <div className="keyword">关键词：<span>{articleDetail.keywords}</span></div>
                <div className="DOI">DOI：{articleDetail.doiCode?articleDetail.doiCode:'暂无DOI'}</div>
                {/*<div className="thesis"></div>*/}
              </div>
              :
              <div className="content">
                <div className="header"><i className="iconfont icon-shuji3" />文献详情</div>
                <div className="loading">
                  <ActivityIndicator text="Loading..."/>
                </div>
              </div>
          }
          {
            articleDetail.journal ?
              <div className="periodical">
                <div className="header"><i className="iconfont icon-wenxianshuji" />来源期刊</div>
                <div className="content"
                     onClick={this.goPeriodicalDetail.bind(this,articleDetail.journalId)}
                >
                  <img src={Img} />
                  <div className="detail">
                    <div className="journal">{articleDetail.journal}</div>
                    {/*<div className="periods">2017年43卷12期</div>*/}
                  </div>
                </div>
              </div>
              :
              <div className="periodical">
                <div className="header"><i className="iconfont icon-wenxianshuji" />来源期刊</div>
                <div className="loading">
                  <ActivityIndicator text="Loading..."/>
                </div>
              </div>
          }
          {
            authorArr.length > 0 ?
              <div className="link">
                <div className="header"><i className="iconfont icon-renwu01" />相关链接</div>
                <div className="content">
                  <div className="btns">
                    {
                      authorArr.length > 0 ? authorArr.map((item, index) => {
                        return item.length > 30 ?
                          <Button
                            key={index}
                            // disabled={true}
                            onClick={this.getAuthorDetail.bind(this, item)}
                            style={{ background: "#999" }}>{item}</Button>
                          :
                          <Button
                            key={index}
                            // disabled={false}
                            onClick={this.getAuthorDetail.bind(this, item)}
                            style={{ background: this.getRandomColor() }}>{item}</Button>
                      }) : <div className="no-list">暂无数据</div>
                    }
                  </div>
                </div>
              </div>
              :
              <div className="link">
                <div className="header"><i className="iconfont icon-renwu01" />相关链接</div>
                <div className="loading">
                  <ActivityIndicator text="Loading..."/>
                </div>
              </div>
          }
          {
            periodical.length > 0 ?
              <div className="similarity">
                <div className="header"><i className="iconfont icon-shuji2" />相似文献</div>
                <List
                  renderFooter={() => <span className="More">更多相似文献>></span>}>
                  {
                    periodical.length > 0 ? periodical.map((item, index) => {
                      let author = item.author ? item.author.split(";") : []
                      return <Item
                        multipleLine
                        wrap
                        key={item.id}
                        onClick={this.goDetail.bind(this, item.id)}>
                        <div className="title"><More text={item.title} words={50} /></div>
                        <div className="row-authorTime">
                          <div className="row-author">{author[0]}</div>
                          <span className="row-time">{item.journal}&nbsp;&nbsp;&nbsp;{moment(item.created_at).format("YYYY[年]MM[月]")}，期刊</span>
                        </div>
                      </Item>
                    }) : <div className="no-list">暂无数据</div>
                  }
                </List>
              </div>
              :
              <div className="similarity">
                <div className="header"><i className="iconfont icon-shuji2" />相似文献</div>
                <div className="loading">
                  <ActivityIndicator text="Loading..."/>
                </div>
              </div>
          }
        </div>
      </div>
    )
  }
}

const IndexWrapper = createForm()(Index);
export default IndexWrapper;
