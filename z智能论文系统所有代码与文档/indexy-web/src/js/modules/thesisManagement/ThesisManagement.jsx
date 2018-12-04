import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { inject } from 'restackx-core'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import Search from '../../components/Search'
import Popconfirm from 'antd/lib/popconfirm'
import AddThesis from './AddThesis'
import { Layout, Breadcrumb, Button, Form, Input, Table, Row, Col, Modal, Tabs, } from 'antd'

const {Header, Content, Footer} = Layout
import { formatTime } from '../../utils/timeFormat'

@withRouter
@inject('indexy')
@observer
export default class ThesisManagement extends Component {
  constructor (props) {
    super(props)
    let urlState = props.history.location.state || {}
    this.state = {
      journal: urlState.journal || '',
      author: '',
      tags: '',
      size: 0, // 页面修改的分页
    }
  }
  componentDidMount() {
    let {journal, page} = this.state
    this.props.indexy.getArticles(page, {
      search: `${journal}`,
    })
  }
  addThesis = () => {
    this.props.indexy.showAddThesis()
  }
  componentWillUnmount() {
    this.props.indexy.resetArticles()
    this.props.indexy.cleanAuthor()
  }
  render() {
    let { btLoading, ThesisModal, isLoading, articles, page, selectKeys, pageSizeOptions, periodicals } = this.props.indexy
    const {journal} = this.state
    const columns = [
      {
        title: '分类',
        dataIndex: 'tags',
        render: text => <span className="table-art-tags ellipsis" title={text}>{text}</span>,
      }, {
        title: '期刊名称',
        dataIndex: 'journal',
        render: text => <span className="table-art-journal ellipsis" title={text}>{text}</span>,
      }, {
        title: '标题',
        dataIndex: 'title',
        render: text => <span className="table-art-title ellipsis" title={text}>{text}</span>,
      }, {
        title: '关键字',
        dataIndex: 'keywords',
        render: text => <span className="table-art-tags ellipsis" title={text}>{text}</span>,
      }, {
        title: '作者',
        dataIndex: 'author',
        render: text => <span className="table-author ellipsis" title={text}>{text}</span>,
      }, {
        title: '发布时间',
        dataIndex: 'publishTime',
        render: text => getFormatUtcTime(text),
      }, {
        title: '摘要',
        dataIndex: 'summary',
        render: text => <span className="table-summary ellipsis" title={text}>{text}</span>,
      }, {
        title: '来源',
        dataIndex: 'sourceUrl',
        render: (text, record) => {
          return (
            <div className="button-group">
              <Button className="button-group" onClick={this.ctlTask.bind(this, 'detail', record)}><a target="_blank" href={record.sourceUrl}>查看论文</a></Button>
              <Popconfirm title="确定删除吗?" onConfirm={this.ctlTask.bind(this, 'del', record)} okText="确定" cancelText="取消">
                <Button className="button-group">删除论文</Button>
              </Popconfirm>
            </div>
          )
        }
      }]
    let tablePagination = {
      current: page.page + 1,
      pageSize: this.state.size ? this.state.size : page.size,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions,
      total: page.count,
      size: "default",
      onChange: this.onPageChange.bind(this),
      onShowSizeChange: this.onPageSizeChange.bind(this),
      showTotal: () => '总数: ' + page.count,
    }
    const rowSelection = {
      selectedRowKeys: selectKeys,
      onChange: this.onSelectChange,
    }
    let searchFields = [
      {
        name: 'journal',
        label: '期刊名称',
        type: 'input',
        value: journal ? journal.split('=')[1] : '',
        placeholder: '期刊名称',
        onChange: this.setSearchParams.bind(this, 'journal'),
      }, {
        name: 'author',
        label: '作者',
        type: 'input',
        value: '',
        placeholder: '作者',
        onChange: this.setSearchParams.bind(this, 'author'),
      }, {
        name: 'tags',
        label: '分类',
        type: 'input',
        value: '',
        placeholder: '分类',
        onChange: this.setSearchParams.bind(this, 'tags'),
      }]

    function getFormatUtcTime(utcTime) {
      let time = formatTime(utcTime)
      return (
        <span>
          <span className="time">{time.split(' ')[0]}&nbsp;</span>
          <span className="time">{time.split(' ')[1]}</span>
        </span>
      )
    }

    return (
      <Layout className="content-box">
        <Header className="content-header">
          <Row>
            <Col span={6}>论文管理</Col>
          </Row>
        </Header>
        <Content className="content-main">
          <Row>
            <Col span={24} className="">
              <Search
                fields={searchFields}
                formItemLayout={{}}
                buttonText="搜索"
                formItemType="inline"
                buttonClass="default-btn search-btn"
                doSearch={this.doSearch}
              />
            </Col>
          </Row>
        </Content>
        <Content className="content-main">
          <Row className="table-header-btn-group">
            <Button className="primary-btn add-task-btn" onClick={this.addThesis}>添加论文</Button>
            <Button className="default-btn del-task-btn" disabled={true}>删除论文</Button>
          </Row>
          <AddThesis ThesisModal={ThesisModal} loading={btLoading} periodicals={periodicals}/>
          <Row className="mgt20">
            <Table
              bordered
              rowSelection={rowSelection}
              columns={columns}
              loading={isLoading}
              dataSource={toJS(articles)}
              pagination={tablePagination}
              rowKey="id"
              scroll={{x: true}}
            />
          </Row>
        </Content>
      </Layout>
    )
  }

  onPageChange = (page) => {
    let {author, journal, tags, size} = this.state
    let search = `${author}${journal}${tags}`
    this.props.indexy.getArticles(page, {
      size,
      search,
    })
  }
  onPageSizeChange = (current, size) => {
    this.setState({size})
    let page = this.props.indexy.defaultPage
    let {author, journal, tags} = this.state
    let search = `${author}${journal}${tags}`
    this.props.indexy.getArticles(page, {
      state: this.state.selectedState,
      size,
      search,
    })
  }
  onSelectChange = (selectedRowKeys) => {
    this.props.indexy.setSelectKey(selectedRowKeys)
  }
  ctlTask = (type, record) => {
    switch (type) {
      case 'del':
        let {author, journal, tags, size} = this.state
        let search = `${author}${journal}${tags}`
        this.props.indexy.delArtical(record.id, {
          search,
          size,
        })
        break
      case 'detail':
        break
        // this.props.history.push(record.sourceUrl)
    }
  }
  setSearchParams = (name, e) => {
    this.setState({
      [name]: `&${name}=${e.target.value}`,
    })
  }

  handleOk = () => {

  }
  handleCancel = () => {
    this.props.indexy.hideModal()
  }
  doSearch = () => {
    let {defaultPage} = this.props.indexy
    let {author, journal, tags, size} = this.state
    let search = `${author}${journal}${tags}`
    this.props.indexy.getArticles(defaultPage, {
      search,
      size,
    })
  }
}
