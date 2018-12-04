/**
 * Created by miffy on 2017/12/06
 */
//用来返回text 当字数太多的时候，显示更多 点击更多 可以看到全部的text
//@params text 全部的text
//@params words 指定字数后 显示为更多

import React from 'react'
import './components.less'

export default class More extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showMore: false
    }
  }
  showMore = (bool) => {
    this.setState({ showMore: bool })
  }
  render() {
    let { text, words } = this.props,
      str = text ? text.substr(0, words) : ''
    return (
      <span className="more" >
        {this.state.showMore ?
          <span>{text}
            <span onClick={this.showMore.bind(this, false)}></span>
          </span>
          :
          //新增disable属性，当disable=true时，屏蔽点击显示全部的功能
            this.props.disable? <span className="hidden-text">{str}{text && text.length <= words ? '' : '...'}</span>:
            <span onClick={this.showMore.bind(this, true)} className="hidden-text">{str}{text && text.length <= words ? '' : '...'}
          </span>
        }
      </span>
    )
  }
}

