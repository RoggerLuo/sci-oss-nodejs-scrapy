/**
 * Created by qingkong on 2017/12/19
 */
import React from 'react'
import { withRouter } from 'react-router'
import { inject } from 'restackx-core'
import { observer } from 'mobx-react'
import Form from 'antd/lib/form'
import Modal from 'antd/lib/modal'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'

const FormItem = Form.Item

@withRouter
@inject('indexy')
@observer
class AddField extends React.Component {
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err){
        this.props.isEdit?
          this.props.indexy.editField(values,this.handleCancel)
          :
          this.props.indexy.addField(values,this.props.id,this.handleCancel)
      }
    })
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.indexy.closeFieldModal()
  }
  render() {
    let { fieldsModal, loading, isEdit, fieldsDetail, id } = this.props
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }
    return (
      <Modal
        title={isEdit?'修改领域':'添加领域'}
        footer={[
          <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
          <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk}>
            保存
          </Button>,
        ]}
        visible={fieldsModal}
        onCancel={this.handleCancel}>
        <div className="addThesis">
          <Form>
            <FormItem {...formItemLayout}
                      label="领域名称">
              {getFieldDecorator('name',{
                initialValue: fieldsDetail?fieldsDetail.name:'',
                rules:[{
                  required: true,
                  message: '不能为空'
                }]
              })(
                <Input />
              )}
            </FormItem>
            {
              this.props.isEdit?
                <FormItem {...formItemLayout}
                          label="父级ID">
                  {getFieldDecorator('parentId',{
                    initialValue: fieldsDetail?fieldsDetail.parentId:''
                  })(
                    <Input />
                  )}
                </FormItem>:null
            }
          </Form>
        </div>
      </Modal>
    )
  }
}

const WrappedAddField = Form.create({})(AddField);
export default WrappedAddField;
