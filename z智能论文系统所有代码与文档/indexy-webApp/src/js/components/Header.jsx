/**
 * Created by qingkong on 2017/11/14
 */
import React from 'react'
import NavBar from 'antd-mobile/lib/nav-bar'

export default class Index extends React.Component {
  render() {
    let { headerOptions, className } = this.props
    let { rightContent, text, icon, onLeftClick, leftContent } = headerOptions
    return (
      <NavBar
        className="nav-header"
        mode="light"
        icon={icon}
        onLeftClick={onLeftClick}
        rightContent={[
          rightContent
        ]}
        leftContent={[
          leftContent
        ]}
      >{text}</NavBar>
    )
  }
}

