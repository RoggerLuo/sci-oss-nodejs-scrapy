import React, { Component } from 'react'
import { Modal, Form, Button } from 'antd'
import Schedule from '../../components/Schedule'

class ModalWithSchedule extends Component {
  handleOk = () => {
    let cron = this.refs.schedule.getCropInput()
    this.props.handleOk(cron.join(' '))
  }
  handleCancel = () => {
    this.props.handleCancel()
  }
  handleSaveNStart = () => {
    let cron = this.refs.schedule.getCropInput()
    this.props.handleSaveNStart(cron.join(' '))
  }
  handleCropInput = (cron) => {
    console.log(cron)
  }
  render() {
    const {
      title, visible, loading, btnTextCancel, className, btnTextOk, isHideFooter
    } = this.props
    return (
      <Modal
        visible={visible}
        title={title}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        wrapClassName={className}
        footer={isHideFooter ? null : [
          <Button key="back" size="large" onClick={this.handleCancel}>{btnTextCancel}</Button>,
          <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk}>
            {btnTextOk}
          </Button>,
          <Button key="start" size="large" loading={false} onClick={this.handleSaveNStart}>保存并运行</Button>,
        ]}
      >
        <Schedule ref="schedule"/>
      </Modal>
    )
  }
}

const ModalWithScheduleWrap = Form.create()(ModalWithSchedule)
export default ModalWithScheduleWrap
