import React from 'react'
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Grid from 'antd-mobile/lib/grid'
import Badge from 'antd-mobile/lib/badge'
import Toast from 'antd-mobile/lib/toast'
import Button from 'antd-mobile/lib/button'
import Nothing from '../../components/Nothing'

import More from '../../components/More'
import path from '../../app/path'
import noPic from '../../../images/defaultCover.png'
@withRouter
@inject("discovery")
@observer
export default class Periodicals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gridHeight: '30%'
    };
  }
  componentDidMount() {
    if(this.props.discovery.periodicalData.length == 0) {
      this.props.discovery.getPeriodicalData()
    }
    const navbar = document.getElementsByClassName('am-navbar-right')[0].offsetHeight
    const footerBar = document.getElementsByClassName('footer-bar')[0].offsetHeight
    const tabs = document.getElementsByClassName('am-tabs-tab-bar-wrap')[0].offsetHeight
    const hei = document.documentElement.clientHeight - footerBar - navbar - tabs;
    this.timer = setTimeout(() => {
      this.setState({
        gridHeight: hei / 3
      });
    }, 600);
  }
  componentWillUnmount() {
    //离开页面时，初始化数据
    this.timer && clearTimeout(this.timer)
    this.props.discovery.reset()
  }
  goPeriodicalDetail = (id) => {
    //进入期刊详情
    this.props.history.push(path.periodicalDetail.url + `/${id}`)
  }
  goAdd = () => {
    this.props.history.push(path.discovery.addPeriodical.url)
  }
  render() {
    let { periodicalData, periodicalLoading } = this.props.discovery,
      gridData = []
      // { data } = this.props

    periodicalData && periodicalData.forEach(data => {
      let obj = {
        id: data.id,
        icon: data.picUrl ? data.picUrl : noPic,
        text: data.name,
        count: data.unReadCount,
        taskId: data.taskId
      }
      gridData.push(obj)
    })
    let gridStyle = {
      height: this.state.gridHeight
    }
    return (
      <div className="periodical-grid">
        {
          periodicalData.length > 0 ?
            <Grid
              hasLine={false}
              data={gridData}
              columnNum={3}
              renderItem={item => (
                <div className="grid-item" onClick={this.goPeriodicalDetail.bind(this, item.taskId)}>
                  <Badge text={item.count}>
                    <div className="grid-icon">
                      <img src={item.icon} alt="暂无封面" />
                    </div>
                  </Badge>
                  <div className="grid-text">
                    <More text={item.text} words={10} />
                    {/* {item.text} */}
                  </div>
                </div>
              )}
              itemStyle={gridStyle}
            />
            :
            periodicalLoading? null : <Nothing onClick={this.goAdd}/>
        }
      </div>
    )
  }
}
