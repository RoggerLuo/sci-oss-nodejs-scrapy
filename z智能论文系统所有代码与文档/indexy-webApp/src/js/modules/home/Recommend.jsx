/**
 * Created by qingkong on 2018/1/3
 */
import React from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import List from 'antd-mobile/lib/list'
import ActivityIndicator from 'antd-mobile/lib/activity-indicator'
import Nothing from '../../components/Nothing'
import ContentListItem from '../../components/content-list-item/ContentListItem'
import xunZhang from '../../../images/home/勋章-2.png'

const Item = List.Item;

@withRouter
@inject('home')
@observer
export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: document.documentElement.clientHeight,
    };
  }
  componentDidMount() {
    const navbar = document.getElementsByClassName('am-navbar-right')[0].offsetHeight
    const app = document.getElementsByClassName('weather')[0].offsetHeight
    const footerBar = document.getElementsByClassName('footer-bar')[0].offsetHeight
    const hei = document.documentElement.clientHeight - app - footerBar - navbar;
    this.timer = setTimeout(() => {
      this.setState({
        height: hei,
      });
    }, 600);
  }
  noData = () => {
    let { indexLoading } = this.props
    if(indexLoading){
      return(
        null
      )
    }else {
      return (
        <Nothing/>
      )
    }
  }
  goDetail = (id) => {
    this.props.history.push(`/details/${id}`)
  }
  componentWillUnmount() {
    //离开页面时，初始化数据
    this.timer && clearTimeout(this.timer)
  }
  render() {
    let { dataSource, selectedFields, recommendData, indexLoading, recommendLoading } = this.props,
      themeData = dataSource.slice(0, 4),
      recommend = recommendData.slice(0, 2)
    return (
      <div className="periodical home-list" ref={el => this.lv = el}>
        <List renderHeader={() => <span><img src={xunZhang} />{selectedFields[0] ? selectedFields[0].name : '暂无领域'}</span>}>
          {
              themeData.length >0 ? themeData.map((item, index) => {
                return <Item
                  key={index}
                  className="card"
                  multipleLine
                  align="top"
                  wrap
                >
                  <ContentListItem type="periodical" item={item} rowID={item.id} />
                </Item>
              }):<div>
                {
                  // recommendLoading||indexLoading ? null : <Nothing/>
                  indexLoading ? null : <Nothing/>
                }
              </div>
          }
        </List>
        {/*<List renderHeader={() => <span className="recommend"><i className='iconfont icon-shoucang' />为您推荐</span>}>*/}
          {/*{*/}
            {/*recommendLoading?*/}
              {/*<div className="loading">*/}
                {/*<ActivityIndicator text="Loading..."/>*/}
              {/*</div>*/}
              {/*:*/}
              {/*recommend.length >0 ? recommend.map((item, index) => {*/}
                {/*return <Item*/}
                  {/*key={index}*/}
                  {/*className="card"*/}
                  {/*multipleLine*/}
                  {/*align="top"*/}
                  {/*wrap*/}
                {/*>*/}
                  {/*<ContentListItem type="periodical" item={item} rowID={item.id} />*/}
                {/*</Item>*/}
              {/*}):<div className="no-list">暂无论文</div>*/}
          {/*}*/}
        {/*</List>*/}
      </div>
    )
  }
}
