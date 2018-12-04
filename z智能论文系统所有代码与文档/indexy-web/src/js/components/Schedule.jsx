import React, { Component } from 'react'
import { Input, Form } from 'antd'
import './schedule.less'
const defaultCron = ['*', '*', '*', '*', '*', '*']
const copyDefaultCron = JSON.parse(JSON.stringify(defaultCron))
export default class Schedule extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cron: copyDefaultCron,
    }
  }
  componentWillUpdate(preProps, preState) {
    // 清空数据
    // console.log('--------', defaultCron.join(''), this.state.cron.join(''))
    // console.log('--------', defaultCron.join('')===this.state.cron.join(''))
    //
    // if (defaultCron.join('') !== this.state.cron.join('')) {
    //   console.log('111111111111111')
    //   this.setState({
    //     cron: ['*', '*', '*', '*', '*', '*'],
    //   })
    // }
  }
  getCropInput = () => {
    return this.state.cron
  }
  _getCropInput = (index, e) => {
    let value = e.target.value.trim()
    let cron = [...this.state.cron]
    cron.splice(index, 1, value)
    this.setState({
      cron,
    })
  }
  render() {
    return (
      <div className="schedule-box">
        <span className="schedule-rule__name">Cron规则：</span>
        <Form className="schedule-form">
          {this.state.cron.map((v, i) => {
            return <Input defaultValue={v} onChange={this._getCropInput.bind(this, i)} key={i} className="input-item"/>
          })}
        </Form>
      </div>
    )
  }
}
