/**
 * Created by qingkong on 2017/12/12
 */
import React from 'react'
import { withRouter } from 'react-router'
import { inject } from 'restackx-core'
import { observer } from 'mobx-react'
import debounce from 'lodash.debounce';
import { toJS } from 'mobx'
import Form from 'antd/lib/form'
import Modal from 'antd/lib/modal'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import TreeSelect from 'antd/lib/tree-select'
import Select from 'antd/lib/select'
import DatePicker from 'antd/lib/date-picker'
import Spin from 'antd/lib/spin'

const FormItem = Form.Item
const TreeNode = TreeSelect.TreeNode
const Option = Select.Option

@withRouter
@inject('indexy')
@observer
class AddThesis extends React.Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 600);
  }
  state = {
    value: [],
    fetching: false,
  }
  fetchUser = (value) => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.props.indexy.searchAuthor(value)
    this.setState({ fetching: true });
  }
  handleChange = (value) => {
    this.props.indexy.cleanAuthor()
    this.setState({
      value,
      fetching: false,
    });
  }
  componentDidMount() {
    this.props.indexy.getFieldFirstLevel()
    // this.props.indexy.getAuthorsDatas()
    this.props.indexy.getPeriodicals()
  }
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err){
        let authorArr = values.author
        values.author = authorArr.join(",")
        let tags = values.tags
        values.tags = tags.join(",")
        this.props.indexy.addThesis(values,this.handleCancel)
      }
    })
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.indexy.closeThesisModal()
  }
  componentWillUnmount() {
    this.props.indexy.cleanAuthor()
  }
  render() {
    let { fields, authors } = this.props.indexy
    const loop = tree => tree.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name}
                    key={String(item.id)}
                    value={item.name}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.name} key={String(item.id)} title={item.name}/>;
    });
    let { ThesisModal, loading, periodicals } = this.props
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
        title={'添加论文'}
        footer={[
          <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
          <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk}>
            保存
          </Button>,
        ]}
        visible={ThesisModal}
        onCancel={this.handleCancel}>
        <div className="addThesis">
          <Form>
            <FormItem {...formItemLayout}
                      label="领域">
              {getFieldDecorator('tags', {
                rules: [{
                  required: true,
                  message: "不能为空",
                }],
              })(
                <TreeSelect
                  multiple
                  placeholder="请选择文章所属领域"
                  notFoundContent="暂无匹配数据"
                  dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                  allowClear>
                  {fields?loop(fields):null}
                </TreeSelect>
              )}
            </FormItem>
            <FormItem {...formItemLayout}
                      label="期刊名称">
              {getFieldDecorator('journal', {
                rules: [{
                  required: true,
                  message: "不能为空",
                }],
              })(
                <Select
                  showSearch
                  placeholder="请选择文章所属期刊"
                  notFoundContent="暂无匹配数据"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  allowClear>
                  {periodicals?
                    periodicals.map((item) => {
                      return <Option key={String(item.id)} title={item.name} value={item.name}>{item.name}</Option>
                    }):"暂无数据"
                  }
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout}
                      label="标题">
              {getFieldDecorator('title', {
                rules: [{
                  required: true,
                  message: "不能为空",
                }],
              })(
                <Input
                  placeholder="请输入文章标题"/>
              )}
            </FormItem>
            <FormItem {...formItemLayout}
                      label="关键字">
              {getFieldDecorator('keywords', {
                rules: [{
                  required: true,
                  message: "不能为空",
                }],
              })(
                <Input
                  placeholder="若有多个，中间用；隔开"/>
              )}
            </FormItem>
            <FormItem {...formItemLayout}
                      label="作者">
              {getFieldDecorator('author', {
                rules: [{
                  required: true,
                  message: "不能为空",
                }],
              })(
                <Select
                  mode="multiple"
                  placeholder="请选择作者"
                  notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchUser}
                  onChange={this.handleChange}
                  allowClear>
                  {authors?
                    authors.map((item) => {
                      return <Option key={String(item.id)} title={item.realname} value={item.realname}>{item.realname}</Option>
                    }):null
                  }
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout}
                      label="发布时间">
              {getFieldDecorator('publishTime', {
                rules: [{
                  required: true,
                  message: "不能为空",
                }],
              })(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="选择时间"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout}
                      label="摘要">
              {getFieldDecorator('summary', {
                rules: [{
                  required: true,
                  message: "不能为空",
                }],
              })(
                <Input.TextArea
                  placeholder="摘要"
                  autosize={{ minRows: 4, maxRows: 6 }}/>
              )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    )
  }
}

const WrappedAddThesis = Form.create({})(AddThesis);
export default WrappedAddThesis;
