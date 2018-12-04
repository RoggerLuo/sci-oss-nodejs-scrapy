/**
 * Created by qingkong on 2017/12/14
 */
import React from 'react'
import { withRouter } from 'react-router'
import { inject } from 'restackx-core'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import Search from '../../components/Search'
import Popconfirm from 'antd/lib/popconfirm'
import AddAuthor from './AddAuthor'
import { Layout, Breadcrumb, Button, Form, Input, Table, Row, Col, Modal, Tabs, } from 'antd'

const { Header, Content } = Layout

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
    this.props.indexy.getAuthorsData()
  }
  onSelectChange = (selectedRowKeys) => {
    this.props.indexy.setSelectKey(selectedRowKeys)
  }
  onPageSizeChange = (current, size) => {
    this.setState({size})
    let page = this.props.indexy.defaultPage
    this.props.indexy.getAuthorsData(page,size)
  }
  onPageChange = (page) => {
    let { size } = this.state
    this.props.indexy.getAuthorsData(page, size)
  }
  addAuthor = () => {
    this.setState({ isEdit: false})
    this.props.indexy.showAddAuthor()
  }
  editAuthor = (id) => {
    this.setState({ isEdit: true})
    this.props.indexy.getAuthorDetail(id)
  }
  confirm = (id) => {
    this.props.indexy.deleteAuthor(id)
  }
  deleteAuthors = (e) => {
    let data = e.join(",")
    this.props.indexy.deleteAuthor(data)
  }
  componentWillUnmount() {
    this.props.indexy.resetArticles()
  }
  render() {
    let { isLoading, selectKeys, pageSizeOptions, authorsPage, authors, authorsSize, authorsCount,
      authorsModal, btLoading, authorsDetail } = this.props.indexy
    const rowSelection = {
      selectedRowKeys: selectKeys,
      onChange: this.onSelectChange,
    }
    const columns = [
      {
        title: '作者ID',
        dataIndex: 'id',
        render: text => <span className="table-art-tags ellipsis" title={text}>{text}</span>,
      }, {
        title: '真实姓名',
        dataIndex: 'realname',
        render: text => <span className="table-art-tags ellipsis" title={text}>{text}</span>,
      }, {
        title: '昵称',
        dataIndex: 'nickname',
        render: text => <span className="table-art-journal ellipsis" title={text}>{text}</span>,
      }, {
        title: '文章总数',
        dataIndex: 'articleCount',
        render: text => <span className="table-art-title ellipsis" title={text}>{text}</span>,
      }, {
        title: '粉丝数量',
        dataIndex: 'fans',
        render: text => <span className="table-art-tags ellipsis" title={text}>{text}</span>,
      }, {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => {
          return (
            <div className="button-group">
              <Button className="button-group" onClick={this.editAuthor.bind(this,record)}>编辑</Button>
              <Popconfirm title="确定删除吗?此操作会删除该作者的所有信息" onConfirm={this.confirm.bind(this,record.id)} okText="确定" cancelText="取消">
                <Button className="button-group">删除</Button>
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
      current: authorsPage,
      pageSize: this.state.size ? this.state.size : authorsSize,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions,
      total: authorsCount,
      size: "default",
      onChange: this.onPageChange.bind(this),
      onShowSizeChange: this.onPageSizeChange.bind(this),
      showTotal: () => '总数: ' + authorsCount,
    }
    return (
      <Layout className="content-box">
        <Header className="content-header">
          <Row>
            <Col span={6}>作者管理</Col>
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
            <Button className="primary-btn add-task-btn" onClick={this.addAuthor}>添加作者</Button>
            <Popconfirm title="确定删除吗?此操作会删除该作者的所有信息" onConfirm={this.deleteAuthors.bind(this,selectKeys)} okText="确定" cancelText="取消">
              <Button className="default-btn del-task-btn" disabled={selectKeys.length ? false : true}>删除作者</Button>
            </Popconfirm>
          </Row>
          <AddAuthor authorsModal={authorsModal} loading={btLoading} isEdit={this.state.isEdit} authorsDetail={authorsDetail}/>
          <Row className="mgt20">
            <Table
              bordered
              rowSelection={rowSelection}
              columns={columns}
              loading={isLoading}
              dataSource={toJS(authors)}
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

