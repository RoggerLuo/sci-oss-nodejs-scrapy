import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { inject } from 'restackx-core'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import Search from '../../components/Search'
import { Layout, Breadcrumb, Button, Form, Input, Table, Row, Col, Modal, Tabs, message } from 'antd'
import TaskModal from '../../components/ModalWithForm'
import ScheduleModal from './ScheduleModal'
import JsonEditor from '../../components/JsonEditor'
import { formatTime } from '../../utils/timeFormat'
import { defaultFileds, defaultOptions } from '../../frame/constant'

const {Header, Content, Footer} = Layout
const confirm = Modal.confirm
const TabPane = Tabs.TabPane
const FormItem = Form.item

@withRouter
@inject('indexy')
@observer
export default class Tasks extends Component {
  constructor(props) {
    super(props)
    let {state} = this.props.location
    let search = state && state.search
    this.state = {
      isEdit: false,
      size: '',
      search: search || '',
    }
  }

  componentDidMount() {
    let {defaultPage} = this.props.indexy
    let {state} = this.props.location
    let search = state && state.search
    this.setState({
      search,
    })
    this.props.indexy.getTasks(defaultPage, {
      search,
    })
  }

  componentWillUnmount() {
    this.props.indexy.resetTask()
  }

  onPageChange = (page) => {
    let {size, search} = this.state
    this.props.indexy.getTasks(page, {
      size,
      search,
    })
  }
  onPageSizeChange = (current, size) => {
    this.setState({size})
    let page = this.props.indexy.defaultPage
    let {search} = this.state
    this.props.indexy.getTasks(page, {
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
  getEditorJson = (obj) => {
    let json = this.refs[obj.name].get()
    if (!json) {
      message.error('请输入合法的json值')
      return false
    } else {
      this.props.indexy.setTaskData({[obj.type]: JSON.stringify(json)})
      return true
    }
  }
  addTasks = () => {
    this.props.indexy.showModal()
  }
  delTasks = () => {
    let ids = this.props.indexy.selectKeys,
     {search, size} = this.state,
      that = this
    confirm({
      title: '确认删除吗',
      content: '删除任务，将会删除该任务爬取的所有文章!',
      onCancel(){},
      onOk ()  {
        that.props.indexy.delTask(ids.join(), {
          search,
          size,
        })
      }
    })
  }

  ctlTask = (type, record) => {
    switch (type) {
      case 'detail':
        this.setState({
          isEdit: true,
        })
        this.props.indexy.showModal()
        this.props.indexy.getTask(record.id, (payload) => {
          this.refs.fieldsEditor.set(JSON.parse(payload.fields))
          this.refs.optionsEditor.set(JSON.parse(payload.options))
        })
        break
      case 'start':
        // 做一个节流
        let now = new Date().getTime()
        let before = sessionStorage.getItem(`startThroneTime${record.id}`) || 0
        let throne = 3 * 1000 // 3s
        if (now - before > throne) {
          this.props.indexy.produceTaskResult(`${record.id}`)
          sessionStorage.setItem(`startThroneTime${record.id}`, now)
        } else {
          message.warning('请3秒后重试')
        }
        break
      case 'scan':
        this.props.indexy.previewTask({
          fields: record.fields,
          url: record.url,
        }, () => {
          this.props.indexy.showCommonModalOk()
        })
        break
      case 'schedule':
        let options = JSON.parse(record.options || '{}')
        if (options.task_opts && options.task_opts.schedule) {
          this.props.indexy.doSchedule({
            id: `${record.id}`,
            schedule: false,
          })
        } else {
          this.props.indexy.showScheduleModal({
            id: `${record.id}`,
            schedule: true,
          })
        }
        break
    }
  }
  changeInput = (name, e) => {
    this.props.indexy.setTaskData({[name]: e.target.value})
  }
  handleOk = (resetCb) => {
    let isJson1 = this.getEditorJson({
      name: 'fieldsEditor',
      type: 'fields',
    })
    let isJson2 = this.getEditorJson({
      name: 'optionsEditor',
      type: 'options',
    })
    if (!isJson1 || !isJson2) return // json不合法返回
    this.props.indexy.addTask(() => {
      this.handleCancel()
      resetCb && resetCb()
    })
  }
  handleTaskCancel = () => {
    let that = this
    const {isEdit} = this.state
    let detail = toJS(this.props.indexy.taskDetail)
    let val = ''
    Object.keys(detail).map((it,i) => {
      val += detail[it]
    })
    if (!isEdit && val.trim()) {
      confirm({
        title: '确认离开编辑数据吗',
        content: '离开后，编辑的数据将会丢失',
        onCancel(){},
        onOk() {
          that.handleCancel()
        },
      })
    } else {
     this.handleCancel()
    }
  }
  handleCancel = () => {
    this.props.indexy.resetTaskModal()
    this.refs.fieldsEditor.set(defaultFileds)
    this.refs.optionsEditor.set(defaultOptions)
    this.setState({
      isEdit: false,
    })
    this.props.indexy.hideModal()
  }
  handleSaveNStart = (resetCb) => {
    this.getEditorJson({
      name: 'fieldsEditor',
      type: 'fields',
    })
    this.getEditorJson({
      name: 'optionsEditor',
      type: 'options',
    })
    this.props.indexy.addTask((res) => {
      if (res.payload) {
        resetCb && resetCb()
        this.handleCancel()
        this.props.indexy.produceTaskResult(`${res.payload.id}`)
      }
    })
  }
  handleScheduleModalCancel = () => {
    this.props.indexy.hideScheduleModal()
  }
  handleScheduleModalOk = (cron) => {
    this.props.indexy.doSchedule({cron})
  }
  handleScheduleSaveNStart = (cron) => {
    this.props.indexy.doScheduleNStart({cron})
  }
  handleCommonModalOk =() => {
    // this.props.indexy.showCommonModalOk()
  }
  handleCommonModalCancel = () => {
    this.props.indexy.hideCommonModalCancel()
  }
  doSearch = () => {
    let {defaultPage} = this.props.indexy // 解构引入方法，会导致this丢失
    let {size, search} = this.state
    this.props.indexy.getTasks(defaultPage, {
      search,
      size,
    })
  }
  handleBtnStatus = (record) => {
    let options = JSON.parse(record.options || '{}')
    let cls = 'button-group'
    let txt = '定时'
    if (options.task_opts && options.task_opts.schedule) {
      cls += ' stop'
      txt = '取消定时'
    }
    return {
      cls,
      txt,
    }
  }

  render() {
    const {
      isModalVisible, isScheduleVisible, isCommonModalVisible, isLoading, tasks, page, pageSizeOptions, selectKeys, taskDetail, previewData,
    } = this.props.indexy
    const {isEdit, search} = this.state
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        render: text => <span className="table-art-title ellipsis" title={text}>{text}</span>,
      }, {
        title: '类型',
        dataIndex: 'type',
        render: text => <span className="table-art-tags ellipsis" title={text}>{text}</span>,
      }, {
        title: 'URL',
        dataIndex: 'url',
        render: text => <span className="table-url ellipsis" title={text}>{text}</span>,
      }, {
        title: '创建时间',
        dataIndex: 'created_at',
        render: (text) => getFormatUtcTime(text),
      }, {
        title: '更新时间',
        dataIndex: 'updated_at',
        render: (text) => getFormatUtcTime(text),
      }, {
        title: '操作',
        dataIndex: 'operate',
        render: (text, record, index) => {
          return (
            <div className="button-group">
              <Button className="button-group" onClick={this.ctlTask.bind(this, 'start', record)}>运行</Button>
              <Button className={this.handleBtnStatus(record).cls} onClick={this.ctlTask.bind(this, 'schedule', record)}>{this.handleBtnStatus(record).txt}</Button>
              <Button className="button-group" onClick={this.ctlTask.bind(this, 'scan', record)}>预览</Button>
              <Button className="button-group" onClick={this.ctlTask.bind(this, 'detail', record)}>详情</Button>
            </div>
          )
        }
      }
    ]
    const rowSelection = {
      type: "radio",
      selectedRowKeys: selectKeys,
      onChange: this.onSelectChange,
    }
    let searchFields = [{
      name: 'search',
      label: '',
      type: 'input',
      value: search ? search.split('=')[1] : '',
      // colSpan: 4,
      placeholder: '对名称,类型,url查询',
      onChange: this.setSearchParams.bind(this, 'search'),
    }]
    let taskModalFields = [
      {
        name: 'name',
        label: '名称',
        type: 'input',
        value: taskDetail.name,
        // colSpan: 4,
        placeholder: '名称',
        rules: [
          { required: true, message: '名称不能为空' },
        ],
        disabled: isEdit,
        onChange: this.changeInput.bind(this, 'name'),
      }, {
        name: 'url',
        label: 'URL',
        type: 'input',
        value: taskDetail.url,
        // colSpan: 4,
        placeholder: 'http://www.example.com',
        disabled: isEdit,
        rules: [
          { required: true, message: 'url不能为空' },
        ],
        onChange: this.changeInput.bind(this, 'url'),
      }, {
        name: 'type',
        label: '类型',
        type: 'input',
        value: taskDetail.type,
        disabled: isEdit,
        rules: [
          { required: true, message: '类型不能为空' },
        ],
        onChange: this.changeInput.bind(this, 'type'),
      }]
    let tablePagination = {
      current: page.page + 1,
      pageSize: this.state.size ? this.state.size : page.size,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions,
      total: page.count,
      size: 'default',
      onChange: this.onPageChange.bind(this),
      onShowSizeChange: this.onPageSizeChange.bind(this),
      showTotal: () => `总数: ${page.count}`,
    }

    function getFormatUtcTime(utcTime) {
      let time = formatTime(utcTime)
      return <span>
        <span className="time">{time.split(' ')[0]}&nbsp;</span>
        <span className="time">{time.split(' ')[1]}</span>
      </span>
    }

    return (
      <Layout className="content-box">
        <Header className="content-header">
          <Row>
            <Col span={6}>任务列表</Col>
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
            <Button className="primary-btn add-task-btn" onClick={this.addTasks}>添加任务</Button>
            <Button
              className="default-btn del-task-btn"
              disabled={selectKeys.length ? false : true}
              onClick={this.delTasks}>删除任务</Button>
          </Row>
          <Row className="mgt20">
            <Table
              bordered
              rowSelection={rowSelection}
              columns={columns}
              loading={isLoading}
              dataSource={toJS(tasks)}
              pagination={tablePagination}
              rowKey="id"
              scroll={{x: true}}
            />
          </Row>
        </Content>
        <TaskModal
          fields={taskModalFields}
          visible={isModalVisible}
          hideRequiredMark={true}
          showThird={true}
          loading={isLoading}
          isHideFooter={isEdit}
          title={isEdit ? '任务详情' : '添加任务'}
          btnTextOk="保存"
          btnTextCancel="取消"
          handleCancel={this.handleTaskCancel}
          handleOk={this.handleOk}
          handleSaveNStart={this.handleSaveNStart}
          className="task-modal custom-modal"
        >
          <Tabs type="card">
            <TabPane tab="选择器" key="1">
              <JsonEditor
                ref="fieldsEditor"
                values={defaultFileds}
              />
            </TabPane>
            <TabPane tab="脚本" key="2">
              <textarea name="script" className="code-box" id="script" placeholder="脚本"/>
            </TabPane>
          </Tabs>
          <div>
            <div className="c-title">可选配置</div>
            <JsonEditor
              ref="optionsEditor"
              values={defaultOptions}
            />
          </div>
          <div>
            <div className="c-title">备注</div>
            <textarea
              value={taskDetail.remark}
              onChange={this.changeInput.bind(this, 'remark')}
              className="code-box remark-box"
            />
          </div>
        </TaskModal>
        <ScheduleModal
          visible={isScheduleVisible}
          title="定时"
          btnTextCancel="取消"
          btnTextOk="保存"
          handleCancel={this.handleScheduleModalCancel}
          handleOk={this.handleScheduleModalOk}
          handleSaveNStart={this.handleScheduleSaveNStart}
        />
        <Modal
          visible={isCommonModalVisible}
          title="任务预览"
          footer={null}
          // onOk={this.handleCommonModalOk}
          onCancel={this.handleCommonModalCancel}
          className="custom-modal"
        >
          <div className="status">
            {
              previewData.success ?
                <span className="succeed">
                  <i className="icon-checked iconfont"/>验证成功
                </span>
                :
                <span className="failure">
                  <i className="icon-closed iconfont"/>验证失败
                </span>
            }
          </div>
          <div>
            <div className="c-title">预览结果</div>
            <JsonEditor
              ref="previewEditor"
              values={previewData.payload}
              type="textEditor"
            />
          </div>
        </Modal>
      </Layout>
    )
  }
}
