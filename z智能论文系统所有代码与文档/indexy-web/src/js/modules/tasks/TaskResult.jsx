import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { inject } from 'restackx-core'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import Search from '../../components/Search'
import { Layout, Button, Select, Table, Row, Col } from 'antd'
import TaskModal from '../../components/ModalWithForm'
import { resultState } from '../../frame/constant'
import { formatTime } from '../../utils/timeFormat'
import path from '../../frame/path'

const {Header, Content} = Layout
const Option = Select.Option

@withRouter
@inject('indexy')
@observer
export default class TaskResult extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEdit: false,
      size: 0, // 页面修改的分页
      // selectedState: '',
      state: '',
      search: '',
      journal: '',
      timer: () => {},
    }
  }

  componentDidMount() {
    let timer
    this.props.indexy.getTasksResult()
    timer = setInterval(() => {
      let {size, search, state} = this.state
      let page = this.props.indexy.page.page + 1 || this.props.indexy.defaultPage // + 1是因为每次调用方法的时候都会-1
      return this.props.indexy.getTasksResult(page, {
        isHideLoading: true,
        search,
        size,
        state,
      })
    }, 10 * 1000)

    this.setState({
      isEdit: false,
      timer,
    })
  }

  componentWillUnmount() {
    this.props.indexy.resetTask()
    clearInterval(this.state.timer)
  }

  render() {
    const {isModalVisible, isLoading, tasksResult, taskResultDetail, page, pageSizeOptions, selectKeys, taskDetail, isEditPage} = this.props.indexy
    const {isEdit} = this.state

    function getFormatUtcTime(utcTime) {
      let time = formatTime(utcTime)
      return <span>
        <span className="time">{time.split(' ')[0]}&nbsp;</span>
        <span className="time">{time.split(' ')[1]}</span>
      </span>
    }
    const columns = [
      {
        title: '名称',
        dataIndex: 'task.name',
        render: (text, record) => <a className="table-art-title ellipsis" href=""
                                     onClick={this.lookTask.bind(this, record)} title={text}>{text}</a>,
      }, {
        title: '类型',
        dataIndex: 'task.type',
        render: text => <span className="table-art-tags ellipsis" title={text}>{text}</span>,
      }, {
        title: 'URL',
        dataIndex: 'task.url',
        render: text => <span className="table-url ellipsis" title={text}>{text}</span>,
      }, {
        title: '任务状态',
        dataIndex: 'state',
        render: (text) => {
          return <span className={text.toLowerCase()}>{resultState[text]}</span>
        },
      }, {
        title: '统计',
        dataIndex: 'progress',
        render: (text, record) => {
          let progress = JSON.parse(record.progress),
            total,
            saved
          if (typeof progress === 'object' && progress) {
            total = progress.total
            saved = progress.saved
          } else {
            total = 0
            saved = 0
          }
          let W = `${saved / total * 100}%`
          return (
            <span className="process-bar">
              <span className="propcess-bg">
                <span className="process-data" style={{width: W}}></span>
                <span className="process-txt">{`${saved}/${total}`}</span>
              </span>
            </span>
          )
        },
      }, {
        title: '创建时间',
        dataIndex: 'created_at',
        render: text => getFormatUtcTime(text),
      }, {
        title: '更新时间',
        dataIndex: 'updated_at',
        render: text => getFormatUtcTime(text),
      }, {
        title: '操作',
        dataIndex: 'operate',
        render: (text, record) => {
          return (
            <div className="button-group">
              <Button className="button-group"
                      disabled={record.state === 'Canceled' || record.state === 'Succeed' || record.state === 'Failure'}
                      onClick={this.ctlTask.bind(this, 'end', record)}>停止</Button>
              <Button className="button-group" onClick={this.ctlTask.bind(this, 'detail', record)}>详情</Button>
              <Button className="button-group" onClick={this.ctlTask.bind(this, 'result', record)}>查看爬取结果</Button>
            </div>
          )
        },
      }]
    const rowSelection = {
      selectedRowKeys: selectKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: (record) => {
        return {
          disabled: ['Canceled', 'Succeed', 'Failure'].indexOf(record.state) === -1, // Column configuration not to be checked
        }
      },
    }
    let searchFields = [{
      name: 'search',
      label: '',
      type: 'input',
      value: '',
      // colSpan: 4,
      placeholder: '对名称,类型,url查询',
      onChange: this.setSearchParams.bind(this, 'search'),
    }]
    let taskModalFields = [
      {
        name: 'name',
        label: '名称',
        type: 'input',
        value: taskResultDetail.task.name,
        disabled: isEdit,
      }, {
        name: 'url',
        label: 'URL',
        type: 'input',
        value: taskResultDetail.task.url,
        disabled: isEdit,
      }, {
        name: 'type',
        label: '类型',
        type: 'input',
        value: taskResultDetail.task.type,
        disabled: isEdit,
      }, {
        name: 'state',
        label: '任务状态',
        type: 'input',
        className: taskResultDetail.state && taskResultDetail.state.toLowerCase(),
        value: resultState[taskResultDetail.state],
        disabled: isEdit,
      }, {
        name: 'description',
        label: '描述',
        type: 'input',
        value: taskResultDetail.description,
        disabled: isEdit,
      }, {
        name: 'created_at',
        label: '创建时间',
        type: 'text',
        value: getFormatUtcTime(taskResultDetail.created_at),
        disabled: isEdit,
      }, {
        name: 'updated_at',
        label: '更新时间',
        type: 'text',
        value: getFormatUtcTime(taskResultDetail.updated_at),
        disabled: isEdit,
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
    return (
      <Layout className="content-box">
        <Header className="content-header">
          <Row>
            <Col span={6}>任务结果</Col>
            <Col span={18} className="">
              <Search
                fields={searchFields}
                formItemLayout={{}}
                buttonText="搜索"
                buttonClass="default-btn search-btn"
                doSearch={this.doSearch}
              />
            </Col>
          </Row>
        </Header>
        <Content className="content-main">
          <Row className="table-header-btn-group">
            <Col span={6}>
              <Button
                className="default-btn del-task-btn"
                disabled={selectKeys.length ? false : true}
                onClick={this.delTasks}
              >删除任务结果
              </Button>
            </Col>
            <Col span={12} push={6} className="col-right-align">
              <Select
                className="filter-state"
                placeholder="任务状态"
                allowClear={true}
                onChange={this.filterState}
              >
                {
                  Object.keys(resultState).map((key, i) => {
                    return <Option value={key} key={i}>{resultState[key]}</Option>
                  })
                }
              </Select>
            </Col>
          </Row>
          <Row className="mgt20">
            <Table
              bordered
              rowSelection={rowSelection}
              columns={columns}
              loading={isLoading}
              dataSource={toJS(tasksResult)}
              pagination={tablePagination}
              rowKey="id"
              scroll={{x: true}}/>
          </Row>
        </Content>
        <TaskModal
          fields={taskModalFields}
          visible={isModalVisible}
          hideRequiredMark={true}
          loading={isLoading}
          isHideFooter={false}
          title="任务结果详情"
          btnTextOk="查看爬取结果"
          btnTextCancel="返回"
          handleCancel={this.handleCancel}
          handleOk={this.handleOk}
          className="task-modal"
        />
      </Layout>
    )
  }

  filterState = (state) => {
    let page = this.props.indexy.defaultPage
    this.setState({state})
    let {size, search} = this.state
    this.props.indexy.getTasksResult(page, {
      state,
      size,
      search,
    })
  }
  onPageChange = (page) => {
    let {size, search, state} = this.state
    this.props.indexy.getTasksResult(page, {
      state,
      size,
      search,
    })
  }
  onPageSizeChange = (current, size) => {
    this.setState({size})
    let page = this.props.indexy.defaultPage
    let {search, state} = this.state
    this.props.indexy.getTasksResult(page, {
      state,
      search,
      size,
    })
  }
  onSelectChange = (selectedRowKeys) => {
    this.props.indexy.setSelectKey(selectedRowKeys)
  }
  setSearchParams = (name, e) => {
    this.setState({
      [name]: `&${name}=${e.target.value}`,
    })
    // this.props.indexy.setSearchParams(`&${name}=${e.target.value}`)
  }
  lookTask = (record, e) => {
    e.preventDefault()
    this.props.history.push(path.tasks.index.url, {
      search: `&search=${record.task.name}`,
    })
  }
  ctlTask = (type, record) => {
    switch (type) {
      case 'detail':
        this.setState({
          isEdit: true,
          journal: record.task.name,
        })
        this.props.indexy.showModal()
        this.props.indexy.getTaskResult(record.id, (payload) => {
          console.log(payload)
        })
        break
      case 'result':
        // 跳转文章列表页面
        this.props.history.push(path.thesisManagement.index.url, {
          journal: `&journal=${record.task.name}`,
        })
        break
    }
  }
  delTasks = () => {
    let ids = this.props.indexy.selectKeys
    let {size, search, state} = this.state
    this.props.indexy.delTaskResult(ids.join(), {
      search,
      size,
      state,
    })
  }
  handleOk = () => {
    let {journal} = this.state
    this.props.history.push(path.thesisManagement.index.url, {
      journal: `&journal=${journal}`,
    })
    this.props.indexy.hideModal()
  }
  handleCancel = () => {
    this.props.indexy.hideModal()
  }
  doSearch = () => {
    let {/**getTasks, **/defaultPage} = this.props.indexy // 解构引入方法，会导致this丢失
    let {size, search, state} = this.state
    this.props.indexy.getTasksResult(defaultPage, {
      search,
      size,
      state,
    })
  }
}
