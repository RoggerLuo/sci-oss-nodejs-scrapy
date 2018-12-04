import React from 'react'
import { observer, inject } from 'mobx-react'
import {withRouter} from 'react-router'
import Flex from 'antd-mobile/lib/flex'
import Checkbox from 'antd-mobile/lib/checkbox'
import Radio from 'antd-mobile/lib/radio'
import Popover from 'antd-mobile/lib/popover'
import Icon from 'antd-mobile/lib/icon'
const PopItem = Popover.Item
const CheckboxItem = Checkbox.CheckboxItem;
const RadioItem = Radio.RadioItem;

@withRouter
@inject("discovery")
@observer
export default class CustomBar extends React.Component {
  constructor(props) {
    super(props)
    let {initCondition, initCustom} = this.props.discovery,
    { type, customDetail, exact } = this.props,
    current = initCustom.find((item) => item.type === type),
      data
    switch (customDetail) {
      case 'and':
        data = '并且'
        break;
      case 'or':
        data = '或者'
        break;
      case 'notContain':
        data = '不含'
        break;
    }
    this.state = {
      current: customDetail?data:'并且',
      visible: false,
      exact: exact ? exact: false
    }
  }
  onSelect = (opt) => {
    let {type} = this.props
    this.setState({ current: opt.props.children })
    this.props.discovery.changeCondition(type, opt.props.value)
  }
  changeCheckBox = (e) => {
    let {type} = this.props
    this.props.discovery.changeExact(type, e.target.checked)
  }
  render() {
    let { current, visible, exact } = this.state
    return (
      <div className="custom-bar">
        <Flex>
          <Flex.Item className="exact-checkbox">
            <CheckboxItem key="exact" onChange={this.changeCheckBox} >
              精确
          </CheckboxItem>
          </Flex.Item>
          <Flex.Item className="condition">
            <Popover
              overlayClassName="condition-pop"
              visible={visible}
              overlay={[
                (<PopItem key="4" value="and">并且</PopItem>),
                (<PopItem key="5" value="or">或者</PopItem>),
                (<PopItem key="6" value="notContain">不含</PopItem>),
              ]}
              onSelect={this.onSelect}
            >
              <span >
                <span>{current}</span>
                <Icon type="down" size="xxs" />
              </span>
            </Popover>
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
