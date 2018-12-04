/**
 * Created by qingkong on 2017/12/14
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
class AddAuthor extends React.Component {
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err){
        this.props.isEdit?
          this.props.indexy.editAuthor(values,this.handleCancel)
          :
          this.props.indexy.addAuthor(values,this.handleCancel)
      }
    })
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.indexy.closeAuthorModal()
  }
  render() {
    let { authorsModal, loading, isEdit, authorsDetail } = this.props
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
        title={isEdit?'修改作者':'添加作者'}
        footer={[
          <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
          <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk}>
            保存
          </Button>,
        ]}
        visible={authorsModal}
        onCancel={this.handleCancel}>
        <div className="addThesis">
          <Form>
            <FormItem {...formItemLayout}
                      label="真实姓名">
              {getFieldDecorator('realname',{
                initialValue: authorsDetail?authorsDetail.realname:'',
                rules:[{
                  required: true,
                  message: '不能为空'
                }]
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout}
                      label="昵称">
              {getFieldDecorator('nickname', {
                initialValue: authorsDetail?authorsDetail.nickname:''
              })(
                <Input />
              )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    )
  }
}

const WrappedAddAuthor = Form.create({})(AddAuthor);
export default WrappedAddAuthor;
