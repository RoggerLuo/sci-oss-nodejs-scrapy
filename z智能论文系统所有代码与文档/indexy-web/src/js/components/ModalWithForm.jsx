import React, { Component } from 'react'
import { Modal, Form, Button, Input, InputNumber } from 'antd'
import HandleFormType from './HandleFormType'

const FormItem = Form.Item

class ModalWithForm extends Component {
  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleOk(this.props.form.resetFields)
      }
    })
  }
  handleCancel = () => {
    this.props.handleCancel()
    this.props.form.resetFields()
  }
  handleSaveNStart = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleSaveNStart(this.props.form.resetFields)
      }
    })
  }
  
  render() {
    const {
      title, visible, loading, btnTextCancel, className, btnTextOk, fields, hideRequiredMark, isHideFooter, showThird,
    } = this.props
    const {
      getFieldDecorator
    } = this.props.form
    let footer = [
      <Button key="back" size="large" onClick={this.handleCancel}>{btnTextCancel}</Button>,
      <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk}>
        {btnTextOk}
      </Button>]
    if (showThird) {
      footer.push(<Button key="start" size="large" loading={false} onClick={this.handleSaveNStart}>保存并运行</Button>)
    }
    return (
      <Modal
        visible={visible}
        title={title}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        wrapClassName={className}
        footer={isHideFooter ? null : footer}
      >
        <Form
          hideRequiredMark={hideRequiredMark}
        >
          <HandleFormType
            fields={fields}
            formInstance={this.props.form}
          />
          {this.props.children}
        </Form>
      </Modal>
    )
  }
}

const ModalWithFormWrap = Form.create()(ModalWithForm)
export default ModalWithFormWrap
