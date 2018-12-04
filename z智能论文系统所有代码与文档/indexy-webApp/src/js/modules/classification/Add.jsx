/**
 * Created by qingkong on 2018/3/6
 */
import React from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import NavBar from '../../components/Header'
import { createForm } from 'rc-form';
import List from 'antd-mobile/lib/list'
import Icon from 'antd-mobile/lib/icon'
import InputItem from 'antd-mobile/lib/input-item'
import Button from 'antd-mobile/lib/button'
import Picker from 'antd-mobile/lib/picker'
import Toast from 'antd-mobile/lib/toast'

const Item = List.Item;

@withRouter
@inject("discovery")
@inject("home")
@inject('label')
@observer
class Add extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Classification: ''
    }
  }
  inputChange = (e) => {
    this.setState({ Classification: e })
  }
  add = () => {
    this.props.form.validateFields((error,values)=>{
      if(!error){
        let { pathname } = this.props.history.location,
          id
        if(pathname.split('/').length == 4){
          id = pathname.split('/')[3]
          this.props.label.editLabel(id,this.state.Classification,this.props.history.goBack())
        }else {
          this.props.label.addLabel(this.state.Classification,this.props.history.goBack())
        }
      }else {
        Toast.fail('请输入内容', 2)
      }
    })
  }
  componentWillUnmount() {
    this.props.form.resetFields()
    this.props.home.sendClassification({})
  }
  render() {
    const { getFieldDecorator, getFieldProps } = this.props.form;
    let { editClassification } = this.props.home
    const headerOptions = {
      rightContent: null,
      text: null,
      leftContent: [
        <i className="iconfont icon-xiangxia-copy" onClick={this.props.history.goBack} />,
        <span>编辑分类名称</span>
      ]
    }
    return (
      <div className="Add">
        <NavBar headerOptions={headerOptions} />
        <div className="title">分类名称</div>
        <List>
          {getFieldDecorator('name', {
            initialValue: editClassification.name,
            rules: [{
              required: true,
              message: '不能为空'
            }],
          })(
            <InputItem
              placeholder="请输入内容"
              onChange={this.inputChange}
            />
          )}
        </List>
        <Button type="primary" onClick={this.add}>确定</Button>
      </div>
    )
  }
}

const AddWrapper = createForm()(Add);
export default AddWrapper;
