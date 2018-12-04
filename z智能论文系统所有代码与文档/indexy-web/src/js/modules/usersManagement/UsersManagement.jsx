/**
 * Created by qingkong on 2017/12/13
 */
import React from 'react'
import { withRouter } from 'react-router'
import { inject } from 'restackx-core'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import Popconfirm from 'antd/lib/popconfirm'
import AddUser from './AddUser'
import { Layout, Breadcrumb, Button, Form, Input, Table, Row, Col, Modal, Tabs, } from 'antd'

const { Header, Content } = Layout
const modalConfirm = Modal.confirm

@withRouter
@inject('indexy')
@observer
export default class UsersManagement extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEdit: false,
      size: 0, // 页面修改的分页
    }
  }
  componentDidMount() {
    this.props.indexy.getUsersData()
  }
  onSelectChange = (selectedRowKeys) => {
    this.props.indexy.setSelectKey(selectedRowKeys)
  }
  onPageSizeChange = (current, size) => {
    this.setState({size})
    let page = this.props.indexy.defaultPage
    this.props.indexy.getUsersData(page,size)
  }
  onPageChange = (page) => {
    let { size } = this.state
    this.props.indexy.getUsersData(page, size)
  }
  addUser = () => {
    this.setState({ isEdit: false})
    this.props.indexy.showAddUser()
  }
  editUser = (id) => {
    this.setState({ isEdit: true})
    this.props.indexy.getUserDetail(id)
  }
  confirm = (id) => {
    this.props.indexy.deleteUser(id)
  }
  deleteUsers = (e) => {
    let data = e.join(",")
    this.props.indexy.deleteUser(data)
  }
  showConfirmDele = (ids) => {
    let that = this
    modalConfirm({
      title: '确定删除吗?',
      content: '删除用户,将会删除该用户相关的所有信息。',
      onOk() {
        that.props.indexy.deleteUser(ids)
      },
      onCancel() {},
    });
  }
  componentWillUnmount() {
    this.props.indexy.resetArticles()
  }
  render() {
    let { btLoading, isLoading, selectKeys, pageSizeOptions, usersPage, users, usersSize, usersCount, UserModal,
      UserDetail } = this.props.indexy
    const rowSelection = {
      selectedRowKeys: selectKeys,
      onChange: this.onSelectChange,
    }
    const columns = [
      {
        title: '用户ID',
        dataIndex: 'id',
        render: text => <span className="table-art-tags ellipsis" title={text}>{text}</span>,
      }, {
        title: '登录账号',
        dataIndex: 'username',
        render: text => <span className="table-art-tags ellipsis" title={text}>{text}</span>,
      }, {
        title: '昵称',
        dataIndex: 'nickName',
        render: text => <span className="table-art-journal ellipsis" title={text}>{text}</span>,
      }, {
        title: '职位',
        dataIndex: 'job',
        render: text => <span className="table-art-title ellipsis" title={text}>{text}</span>,
      }, {
        title: '学校',
        dataIndex: 'school',
        render: text => <span className="table-art-tags ellipsis" title={text}>{text}</span>,
      }, {
        title: '手机号码',
        dataIndex: 'mobile',
        render: text => <span className="table-author ellipsis" title={text}>{text}</span>,
      }, {
        title: '邮箱',
        dataIndex: 'email',
        render: text => <span className="table-author ellipsis" title={text}>{text}</span>,
      }, {
        title: '简介',
        dataIndex: 'introduct',
        render: text => <span className="table-author ellipsis" title={text}>{text}</span>,
      }, {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => {
          return (
            <div className="button-group">
              <Button className="button-group" onClick={this.editUser.bind(this,record.id)}>编辑</Button>
              <Popconfirm title="确定删除吗?此操作会删除该用户的所有信息" onConfirm={this.confirm.bind(this,record.id)} okText="确定" cancelText="取消">
                <Button className="button-group">删除</Button>
                {/*因为删除用户牵扯到很多数据库相关，故暂时禁止删除用户*/}
              </Popconfirm>
            </div>
          )
        }
      }]
    // let searchFields = [
    //   {
    //     name: 'username',
    //     label: '用户名',
    //     type: 'input',
    //     value: '',
    //     placeholder: '用户名',
    //     // onChange: this.setSearchParams.bind(this, 'journal'),
    //   }, {
    //     name: 'nickName',
    //     label: '昵称',
    //     type: 'input',
    //     value: '',
    //     placeholder: '昵称',
    //     onChange: this.setSearchParams.bind(this, 'author'),
    //   }]
    let tablePagination = {
      current: usersPage,
      pageSize: this.state.size ? this.state.size : usersSize,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions,
      total: usersCount,
      size: "default",
      onChange: this.onPageChange.bind(this),
      onShowSizeChange: this.onPageSizeChange.bind(this),
      showTotal: () => '总数: ' + usersCount,
    }
    return (
      <Layout className="content-box">
        <Header className="content-header">
          <Row>
            <Col span={6}>用户管理</Col>
          </Row>
        </Header>
        <Content className="content-main">
          <Row className="table-header-btn-group">
            <Button className="primary-btn add-task-btn" onClick={this.addUser}>添加用户</Button>
            {/*<Popconfirm title="确定删除吗?此操作会删除该用户的所有信息" onConfirm={this.deleteUsers.bind(this, selectKeys)} okText="确定" cancelText="取消">*/}
            <Button className="default-btn del-task-btn" onClick={this.showConfirmDele.bind(this, selectKeys)}>删除用户</Button>
              {/*因为删除用户牵扯到很多数据库相关，故暂时禁止删除用户*/}
            {/*</Popconfirm>*/}
          </Row>
          <AddUser UserModal={UserModal} loading={btLoading} isEdit={this.state.isEdit} UserDetail={UserDetail}/>
          <Row className="mgt20">
            <Table
              bordered
              rowSelection={rowSelection}
              columns={columns}
              loading={isLoading}
              dataSource={toJS(users)}
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

