/**
 * Created by qingkong on 2017/11/13
 */
// 感兴趣领域 暂时废弃
import React from 'react'
import {withRouter} from 'react-router'
import {observer,inject} from 'mobx-react'
import Icon from 'antd-mobile/lib/icon'
import Grid from 'antd-mobile/lib/grid'
import path from '../../app/path'

import Logo from '../../components/Logo'
import NavBar from '../../components/Header'
import literature from '../../../images/discovery/书@2x.png'
import medical from '../../../images/discovery/医疗-3@2x.png'
import history from '../../../images/discovery/历史@2x.png'
import education from '../../../images/discovery/教育@2x.png'
import philosophy from '../../../images/discovery/文学-01@2x.png'
import MechanicalEngineering from '../../../images/discovery/机械设计@2x.png'
import add from '../../../images/discovery/添加-4@2x.png'
import physics from '../../../images/discovery/物理@2x.png'
import biology from '../../../images/discovery/生物@2x.png'
import art from '../../../images/discovery/绘画创作@2x.png'
import computers from '../../../images/discovery/计算机_computer160@2x.png'
import economics from '../../../images/discovery/钱@2x.png'

@withRouter
@inject("discovery")
@observer
export default class Index extends React.Component {
  componentDidMount() {
    this.props.discovery.getFirstFields()
  }
  doJump = () => {
    this.props.history.push(path.home.url)
  }
  goSecondFields = (obj) => {
    this.props.history.push(`/interested/subdivision/${obj.key}`)
  }
  render() {
    let {firstFields} = this.props.discovery
    const headerOptions = {
      rightContent:<span key="1" onClick={this.doJump}>跳过</span>,
      text: 'Indexy',
      icon: <Icon size="md" type="left"/>,
      onLeftClick: this.props.history.goBack,
    }
    let data = []
    firstFields.forEach((item)=> {
      let obj = {
        text: item.name,
        key: item.id
      }
      data.push(obj)
    })
    const GridExample = () => (
      <div>
        <div className="sub-title">-请选择你感兴趣的类型-</div>
        <Grid
        data={data}
        columnNum={3}
        hasLine={false}
        activeStyle={{background: 'transparent'}}
        activeClassName ='ssss'
        onClick={this.goSecondFields}
        renderItem={dataItem => (
          <div className="grid-item">
          <Logo name={dataItem.text}/>
          <div className="item-text">
            <span>{dataItem.text}</span>
          </div>
          </div>
        )}
        />
      </div>
    );
    return (
      <div className="interested">
        <NavBar headerOptions={headerOptions} />
        <GridExample/>
      </div>
    )
  }
}

