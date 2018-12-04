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
class AddUser extends React.Component {
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(this.props.isEdit){
        if(!values.nickname){
          values.nickname = values.username
        }
        if(values.username){
          this.props.isEdit?
            this.props.indexy.editUser(values,this.handleCancel)
            :
            this.props.indexy.addUser(values,this.handleCancel)
        }
      }
      if(!err){
        if(!values.nickname){
          values.nickname = values.username
        }
        this.props.isEdit?
          this.props.indexy.editUser(values,this.handleCancel)
          :
          this.props.indexy.addUser(values,this.handleCancel)
      }
    })
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.indexy.closeUserModal()
  }
  render() {
    let { UserModal, loading, isEdit, UserDetail } = this.props
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
        title={isEdit?'修改用户':'添加用户'}
        footer={[
          <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
          <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk}>
            保存
          </Button>,
        ]}
        visible={UserModal}
        onCancel={this.handleCancel}>
        <div className="addThesis">
          <Form>
            <FormItem {...formItemLayout}
                      label="登录账号">
              {getFieldDecorator('username', {
                initialValue: UserDetail?UserDetail.username:'',
                rules: [{
                  required: true,
                  message: "不能为空",
                },{
                  pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/g,
                  message: "请输入11位手机号码",
                }],
              })(
                <Input placeholder="手机号"/>
              )}
            </FormItem>
            {
              isEdit?null
                :
              <FormItem {...formItemLayout}
                        label="密码">
                {getFieldDecorator('password', {
                  initialValue: UserDetail?UserDetail.password:'',
                  rules: [{
                    required: true,
                    message: "不能为空",
                  }],
                })(
                  <Input type="password"/>
                )}
              </FormItem>

            }
            <FormItem {...formItemLayout}
                      label="昵称">
              {getFieldDecorator('nickname', {
                initialValue: UserDetail?UserDetail.nickname:''
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout}
                      label="职位">
              {getFieldDecorator('job',{
                initialValue: UserDetail?UserDetail.job:'',
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout}
                      label="学校">
              {getFieldDecorator('school',{
                initialValue: UserDetail?UserDetail.school:'',
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout}
                      label="手机号">
              {getFieldDecorator('mobile',{
                initialValue: UserDetail?UserDetail.mobile:'',
                rules: [{
                  pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/g,
                  message: "请输入11位手机号码",
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout}
                      label="邮箱">
              {getFieldDecorator('email',{
                initialValue: UserDetail?UserDetail.email:'',
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout}
                      label="简介">
              {getFieldDecorator('introduct',{
                initialValue: UserDetail?UserDetail.introduct:'',
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

const WrappedAddUser = Form.create({})(AddUser);
export default WrappedAddUser;
