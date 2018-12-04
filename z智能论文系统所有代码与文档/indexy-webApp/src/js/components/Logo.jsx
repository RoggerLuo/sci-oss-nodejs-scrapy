/**
 * Created by miffy on 2017/11/16
 */
//用来返回一个显示首字母的头像
//@params name
//@params width 宽度
//@params height 高度

import React from 'react'
import './components.less'

export default class Logo extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        color: this.getRandomColor()
      }
    }
   getRandomColor = () => {
     //生成随机的色号
     let color = (Math.random()*0xffffff<<0).toString(16)
     if(color.length<6) {
      color = '6da7ff'
     }
     return '#'+color;
    }
  render() {
    let { name, width, height, className } = this.props,
     str = name.substr(0, 1),
     color = this.state.color
    return (
      <span className={"logo " + className} style={{background: color, width: width, height: height, lineHeight: height}}> 
        <span className="logo-string">{str}</span>
      </span>
    )
  }
}

