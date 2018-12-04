import React from 'react'
import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import NavBar from '../../components/Header'
import PDF from '../../components/Pdf'
import TabBar from 'antd-mobile/lib/tab-bar'
import { getCookie } from '../../utils/cookies'
import Popover from 'antd-mobile/lib/popover'
import api from '../discovery/api'
import List from 'antd-mobile/lib/list'
import yellowStart from '../../../images/shoucang.png'
import ActivityIndicator from 'antd-mobile/lib/activity-indicator'

const Item = List.Item;


@withRouter
@inject("discovery")
@inject("home")
@observer
export default class Read extends React.Component {
  constructor(props) {
    super(props)
    // const { match: { params } } = props,
    //   { PDFs } = this.props.discovery
    // if(!PDFs){
    //   this.props.discovery.getPdf(params.id)
    // }
  }
  componentDidMount() {
    const { match: { params }, home } = this.props
    // home.getArticle(params.id)
    // home.getLabel()
    // home.getPeriodicalData()
  }
  onSelectPopover = () => {
    const { match: { params }, home: { articleDetail }, history } = this.props
    this.props.home.sendArticleDetail(articleDetail)
    history.push(`/classification/${params.id}`)
  }
  delCollect = (id) => {
    this.props.home.delCollect(id)
  }
  down = () => {
    const { match: { params } } = this.props,
      uid = getCookie('userID')
      var elemIF = document.createElement("iframe");
      elemIF.src = api.pdf(uid, params.id, true);
      elemIF.style.display = "none";
      document.body.appendChild(elemIF);
  }
  goBack = () => {
    this.props.discovery.reset()
    this.props.home.reset()
    this.props.history.goBack()
  }
  render() {
    const { match: { params }, discovery: { PDFs, PDFLoading }, home: { articleDetail } } = this.props
    const uid = getCookie('userID')
    const headerOptions = {
      rightContent: [
        articleDetail.isCollection?
          <Popover mask
                   overlayClassName="details-popover"
                   overlayStyle={{ color: 'currentColor' }}
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
      ]
    }
    return (
      <div className="read-me">
        <NavBar headerOptions={headerOptions} />
        {/* <PDF url="http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf"/> */}
        {/* { !PDFLoading && <PDF url={PDFs}/> } */}
        <PDF url={api.pdf(uid,params.id,false)}/>
        <div className="footer-bar">
          <TabBar
            unselectedTintColor="#949494"
            tintColor="#33A3F4"
            barTintColor="white"
          >
            <TabBar.Item
              key="down"
              icon={<i className="iconfont icon-xiazai1" />}
              // selectedIcon={<img className="iconfont" src={Index1} />}
              // data-seed="logId"
              onPress={this.down}
              // selected={href === path.home.url}
            >
            </TabBar.Item>
            {
              articleDetail.isCollection ?
              <TabBar.Item
                icon={<img src={yellowStart}/>}
                // selectedIcon={<img className="iconfont" src={discovery1} />}
                key="qxshoucang"
                // data-seed="logId1"
                onPress={this.delCollect.bind(this,articleDetail.id)}
                // selected={href === path.discovery.index.url}
              >
              </TabBar.Item>
                :
              <TabBar.Item
                icon={<i className="iconfont icon-shoucang4" />}
                // selectedIcon={<img className="iconfont" src={discovery1} />}
                key="shoucang"
                // data-seed="logId1"
                onPress={this.onSelectPopover}
                // selected={href === path.discovery.index.url}
              >
              </TabBar.Item>
            }
            <TabBar.Item
              icon={<i className="iconfont icon-fenxiang1" />}
              // selectedIcon={<img className="iconfont" src={work1} />}
              key="fenxiang"
              // selected={href === path.work.url}
              // onPress={this.handleTabbarPress.bind(this, 'work')}
            >
            </TabBar.Item>
            <TabBar.Item
              icon={<i className="iconfont icon-bianji" />}
              // selectedIcon={<img className="iconfont" src={my1} />}
              key="bianji"
              // selected={href === path.my.index.url || href === path.my.concern.url}
              // onPress={this.handleTabbarPress.bind(this, 'account')}
            >
            </TabBar.Item>
          </TabBar>
        </div>
      </div>
    )
  }
}
