/**
 * Created by qingkong on 2017/12/19
 */
import React from 'react'
import { withRouter } from 'react-router'
import { inject } from 'restackx-core'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import Search from '../../components/Search'
import Popconfirm from 'antd/lib/popconfirm'
import AddField from './AddField'
import { Layout, Breadcrumb, Button, Form, Input, Table, Row, Col, Modal, Tabs, } from 'antd'

const { Header, Content } = Layout

@withRouter
@inject('indexy')
@observer
export default class FieldsManagement extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEdit: false,
      size: 0, // 页面修改的分页
      id:'',//新增领域时的parentId
      searchID: ''//记录搜索框信息
    }
  }
  componentDidMount() {
    this.props.indexy.getFieldFirstLevel()
  }
  onSelectChange = (selectedRowKeys) => {
    this.props.indexy.setSelectKey(selectedRowKeys)
  }
  onPageSizeChange = (current, size) => {
    this.setState({size})
    let page = this.props.indexy.defaultPage
    // this.props.indexy.getAuthorsData(page,size)
  }
  onPageChange = (page) => {
    let { size } = this.state
    // this.props.indexy.getAuthorsData(page, size)
  }
  addField = (id) => {
    this.setState({ isEdit: false, id: id})
    this.props.indexy.showAddField()
  }
  editField = (id) => {
    this.setState({ isEdit: true})
    this.props.indexy.getFieldDetail(id)
  }
  confirm = (id) => {
    this.props.indexy.deleteField(id)
  }
  deleteFields = (e) => {
    let data = e.join(",")
    this.props.indexy.deleteField(data)
  }
  setSearch = (e) => {
    this.setState({
      searchID: e.target.value,
    })
  }
  doSearch = () => {
    if(this.state.searchID){
      this.props.indexy.searchFields(this.state.searchID)
    }else {
      this.props.indexy.getFieldFirstLevel()
    }
  }
  componentWillUnmount() {
    this.props.indexy.resetArticles()
  }
  render() {
    let { isLoading, selectKeys, pageSizeOptions, fieldsPage, fields, fieldsSize, fieldsCount,
      fieldsModal, btLoading, fieldsDetail } = this.props.indexy
    const rowSelection = {
      selectedRowKeys: selectKeys,
      onChange: this.onSelectChange,
    }
    const columns = [
      {
        title: '领域名称',
        dataIndex: 'name',
        render: text => <span className="table-art-tags" title={text}>{text}</span>,
      }, {
        title: '领域ID',
        dataIndex: 'id',
        render: text => <span className="table-art-tags" title={text}>{text}</span>,
      }, {
        title: '父级领域ID',
        dataIndex: 'parentId',
        render: text => <span className="table-art-journal" title={text}>{text}</span>,
      }, {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => {
          return (
            <div className="button-group">
              <Button className="add-task-btn" onClick={this.addField.bind(this,record.id)}>添加领域</Button>
              <Button className="button-group" onClick={this.editField.bind(this,record)}>编辑</Button>
              <Popconfirm title="确定删除吗?此操作会删除该领域的所有信息" onConfirm={this.confirm.bind(this,record.id)} okText="确定" cancelText="取消">
                <Button className="button-group">删除</Button>
              </Popconfirm>
            </div>
          )
        }
      }]
    let searchFields = [
      {
        name: 'ID',
        label: '领域ID',
        type: 'input',
        value: '',
        placeholder: '领域ID',
        onChange: this.setSearch,
      }]
    let tablePagination = {
      current: fieldsPage,
      pageSize: this.state.size ? this.state.size : fieldsSize,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions,
      total: fieldsCount,
      size: "default",
      onChange: this.onPageChange.bind(this),
      onShowSizeChange: this.onPageSizeChange.bind(this),
      showTotal: () => '总数: ' + fieldsCount,
    }
    return (
      <Layout className="content-box">
        <Header className="content-header">
          <Row>
            <Col span={6}>领域管理</Col>
          </Row>
        </Header>
        {/*<Content className="content-main">*/}
          {/*<Row>*/}
            {/*<Col span={24} className="">*/}
              {/*<Search*/}
              {/*fields={searchFields}*/}
              {/*formItemLayout={{}}*/}
              {/*buttonText="搜索"*/}
              {/*formItemType="inline"*/}
              {/*buttonClass="default-btn search-btn"*/}
              {/*doSearch={this.doSearch}*/}
              {/*/>*/}
            {/*</Col>*/}
          {/*</Row>*/}
        {/*</Content>*/}
        <Content className="content-main">
          <Row className="table-header-btn-group">
            <Button className="primary-btn add-task-btn" onClick={this.addField.bind(this,'')}>添加领域</Button>
            <Popconfirm title="确定删除吗?此操作会删除该领域的所有信息" onConfirm={this.deleteFields.bind(this,selectKeys)} okText="确定" cancelText="取消">
              <Button className="default-btn del-task-btn" disabled={selectKeys.length ? false : true}>删除领域</Button>
            </Popconfirm>
          </Row>
          <AddField id={this.state.id} fieldsModal={fieldsModal} loading={btLoading} isEdit={this.state.isEdit} fieldsDetail={fieldsDetail}/>
          <Row className="mgt20">
            <Table
              bordered
              indentSize={50}
              rowSelection={rowSelection}
              columns={columns}
              loading={isLoading}
              dataSource={toJS(fields)}
              pagination={tablePagination}
              rowKey="id"
              scroll={{x: true}}
            />
          </Row>
        </Content>
      </Layout>
    )
  }
}

