import { observable } from 'mobx'
import message from 'antd/lib/message'
import fetch from '../common/fetch'
import api from './api'

export default class indexyStore {
  defaultSize = 10
  defaultPage = 1
  scheduleObj = {}
  pageSizeOptions = ['10', '20', '50']
  @observable isModalVisible = false
  @observable isScheduleVisible = false
  @observable isCommonModalVisible = false
  @observable isLoading = false
  @observable taskDetail = {}
  @observable taskResultDetail = {
    task: {},
  }
  @observable tasks = []
  @observable tasksResult = []
  @observable articles = []
  @observable articleDetail = {}
  @observable previewData = {
    payload: {}
  }
  @observable selectKeys = []
  @observable page = {
    page: this.defaultPage,
    size: this.defaultSize,
    count: 0,
  }
  @observable search = ''
  @observable ThesisModal = false
  initialPage = 0
  @observable btLoading = false
  @observable users = []
  @observable usersPage = 0
  @observable usersSize = 0
  @observable usersCount = 0
  @observable UserModal = false
  @observable UserDetail = {}
  @observable authors = []
  @observable authorsPage = 0
  @observable authorsSize = 0
  @observable authorsCount = 0
  @observable authorsModal = false
  @observable authorsDetail = {}
  @observable fields = []
  @observable fieldsPage = 0
  @observable fieldsSize = 0
  @observable fieldsCount = 0
  @observable fieldsModal = false
  @observable fieldsDetail = {}
  @observable periodicals = []
  // 对于需要跨路由使用的参数，如结果页面查看爬取结果，跳转文章列表页面
  //改在路由中传递更简单
  // @observable crossRouterParams = {}
  async addTask(cb) {
    this.isLoading = true
    try {
      let res = await fetch(api.tasks, {
        type: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(this.taskDetail),
      })
      if (res.payload) {
        this.isLoading = false
        this.isModalVisible = false
        this.asynFeedback(true)
        this.getTasks() // 刷新list
        cb && cb(res)
      }
    } catch (e) {
      this.isLoading = false
      this.isModalVisible = false
      this.asynFeedback(false)
      cb && cb(e)
    }
  }
  /**
   * @param ids string 1,2,3
   */
  async delTask(ids = '', params={}) {
    this.isLoading = true
    try {
      let query = `/${ids}`
      let res = await fetch(api.tasks + query, {
        type: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      this.isLoading = false
      if (res.payload) {
        this.asynFeedback(true)
        this.getTasks(this.defaultPage, params)
        this.selectKeys = []
      }
    } catch (err) {
      this.isLoading = false
      if (err.status == 400) {
        this.asynFeedback(false, {
          failMsg: '任务在运行中，请先删除运行中的任务',
        })
        this.selectKeys = []
      }
    }
  }
  /**
   * result
   * @param ids string 1,2,3
   */
  async delTaskResult(ids = '', params={}) {
    this.isLoading = true
    try {
      let query = `/${ids}`
      let res = await fetch(api.tasksReult + query, {
        type: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      this.isLoading = false
      if (res.payload) {
        this.asynFeedback(true)
        this.getTasksResult(this.defaultPage, params)
        this.selectKeys = []
      }
    } catch (e) {
      this.isLoading = false
      this.asynFeedback(false)
    }
  }
  async delArtical(ids='', params={}) {
    this.isLoading = true
    try {
      let query = `/${ids}`
      let res = await fetch(api.articles + query, {
        type: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      this.isLoading = false
      if (res.payload) {
        this.asynFeedback(true)
        this.getArticles(this.defaultPage, params)
        // this.selectKeys = []
      }
    } catch (e) {
      this.isLoading = false
      this.asynFeedback(false)
    }
  }
  async produceTaskResult(id = '') {
    this.isLoading = true
    let query = `/?taskId=${id}`
    try {
      let data = {taskId: id}
      let res = await fetch(api.tasksReult + query, {
        type: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      if (res.payload) {
        this.asynFeedback(true)
      }
      this.isLoading = false
    } catch (e) {
      this.isLoading = false
      this.asynFeedback(false)
    }
  }
  async previewTask(data, cb) {
    this.isLoading = true
    try {
      let res = await fetch(api.taskPreView, {
        type: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(data),
      })
      if (res.payload) {
        this.isLoading = false
        this.previewData.payload = res.payload
        this.previewData.success = res.success
        cb && cb(res)
        // this.asynFeedback(true)
      }
    } catch (e) {
      this.isLoading = false
      // this.isModalVisible = false
      this.asynFeedback(false)
    }
  }
  async doSchedule(obj) {
    this.isLoading = true
    let id = this.scheduleObj.id
    let data = {}
    if (obj.cron) {
      data.schedule = this.scheduleObj.schedule
      id = this.scheduleObj.id
      data.cron = obj.cron
    } else {
      data.schedule = obj.schedule
      id = obj.id
    }
    try {
      let res = await fetch(api.schedule(id), {
        type: 'PUT',
        data: JSON.stringify(data),
      })
      if (res.payload) {
        this.isLoading = false
        this.isScheduleVisible = false
        this.getTasks()
        this.asynFeedback(true)
      }
    } catch (e) {
      this.isLoading = false
      this.isScheduleVisible = false
      this.asynFeedback(false)
    }
  }
  async doScheduleNStart(obj) {
    this.isLoading = true
    let id = this.scheduleObj.id
    let data = {}
    data.schedule = this.scheduleObj.schedule
    data.cron = obj.cron
    try {
      let res = await fetch(api.schedule(id), {
        type: 'PUT',
        data: JSON.stringify(data),
      })
      if (res.payload) {
        // 运行任务
        this.produceTaskResult(id)
        this.isScheduleVisible = false // 应该在produceTaskResult回调后在处理
        this.getTasks()
      }
    } catch (e) {
      this.isLoading = false
      this.isScheduleVisible = false
      this.asynFeedback(false)
    }
  }
  async getTasks(page = 1, params={}) {
    let newPage = page - 1
    let search = params.search ? params.search : ''
    let size = params.size ? params.size : this.page.size
    let query = `?page=${newPage}&size=${size}${search}`
    this.isLoading = true
    try {
      let res = await fetch(api.tasks + query)
      if (res.payload) {
        this.isLoading = false
        this.tasks = res.payload.rows
        this.page.count = res.payload.count
        this.page.page = newPage
      }
    } catch (e) {
      this.isLoading = false
    }
  }
  /**
   * @param id 任务id
   * @param cb function 回调
   */
  async getTask(id, cb) {
    this.isLoading = true
    let query = `/${id}`
    try {
      let res = await fetch(api.tasks + query)
      if (res.payload) {
        this.taskDetail = res.payload
      }
      cb && cb(res.payload) // 根据返回的值，设置jsonEditor的数据
      this.isLoading = false
    } catch (e) {
      this.isLoading = false
      cb && cb(e)
    }
  }
  /**
   * @param id 任务结果id
   * @param cb function 回调
   */
  async getTaskResult(id, cb) {
    this.isLoading = true
    let query = `/${id}`
    try {
      let res = await fetch(api.tasksReult + query)
      if (res.payload) {
        this.taskResultDetail = res.payload
      }
      cb && cb(res.payload)
      this.isLoading = false
    } catch (e) {
      this.isLoading = false
      cb && cb(e)
    }
  }
  async getTasksResult(page = 1, params = {}) {
    let newPage = page - 1
    let state = params.state ? params.state : ''
    let search = params.search ? params.search : ''
    let size = params.size ? params.size : this.page.size
    let query = `?page=${newPage}&size=${size}&state=${state}${search}`
    if (!params.isHideLoading) { // 任务结果页面10s刷新一次，不显示loading
      this.isLoading = true
    }
    try {
      let res = await fetch(api.tasksReult + query)
      if (res.payload) {
        this.isLoading = false
        this.tasksResult = res.payload.rows
        this.page.count = res.payload.count
        this.page.page = newPage
      }
    } catch (e) {
      this.isLoading = false
    }
  }
  async getArticles(page = 1, params = {}) {
    let newPage = page - 1
    let search = params.search ? params.search : ''
    let size = params.size ? params.size : this.page.size
    let query = `?page=${newPage}&size=${size}${search}`
    this.isLoading = true
    try {
      let res = await fetch(api.articles + query)
      if (res.payload) {
        this.isLoading = false
        this.articles = res.payload.rows
        this.page.count = res.payload.count
        this.page.page = newPage
      }
    } catch (e) {
      this.isLoading = false
    }
  }
  async getUsersData(page,size) {
    let pages = page?page - 1:this.initialPage,
      sizes = size?size:this.defaultSize
    this.usersPage = page? page : pages
    this.usersSize = size? size : sizes
    this.isLoading = true
    let query = `?page=${pages}&size=${sizes}&order=id,desc`
    try {
      let res = await fetch(api.getUser + query)
      this.users = res.payload.rows
      this.usersCount = res.payload.count
      this.isLoading = false
    } catch (e) {
      this.isLoading = false
    }
  }
  async getUserDetail(id) {
    this.isLoading = true
    try {
      let res = await fetch(api.getUser + `/` + id)
      this.UserDetail = res.payload
      this.isLoading = false
      this.showAddUser()
    } catch (e) {
      this.isLoading = false
    }
  }
  async editUser(e,callback) {
    this.btLoading = true
    let id = this.UserDetail.id
    try {
      let res = await fetch(api.getUser + `/` + id,{
        type:'PUT',
        data: JSON.stringify(e)
      })
      this.btLoading = false
      this.asynFeedback(true)
      callback()
      this.getUsersData()
    } catch (e) {
      this.asynFeedback(false)
      this.btLoading = false
    }
  }
  async addUser(e,callback) {
    this.btLoading = true
      try {
        let res = await fetch(api.getUser,{
          type: 'POST',
          data: JSON.stringify(e)
        })
        this.asynFeedback(true)
        this.btLoading = false
        this.UserModal = false
        callback()
        this.getUsersData()
      } catch (e) {
        this.asynFeedback(false)
        this.btLoading = false
      }
  }
  async deleteUser(e) {
    this.isLoading = true
      try {
        let res = await fetch(api.getUser + `/` + e,{
          type: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        this.asynFeedback(true)
        this.isLoading = false
        this.getUsersData()
      } catch (e) {
        this.asynFeedback(false)
        this.isLoading = false
      }
  }
  async getAuthorsDatas() {
    this.isLoading = true
    let query = `?size=50&page=0`
    try {
      let res = await fetch(api.getAuthor + query)
      this.authors = res.payload.rows
      this.authorsCount = res.payload.count
      this.isLoading = false
    } catch (e) {
      this.isLoading = false
    }
  }
  async getAuthorsData(page,size) {
    let pages = page?page - 1:this.initialPage,
      sizes = size?size:this.defaultSize
    this.authorsPage = page? page : pages
    this.authorsSize = size? size : sizes
    this.isLoading = true
    let query = `?size=${sizes}&page=${pages}`
    try {
      let res = await fetch(api.getAuthor + query)
      this.authors = res.payload.rows
      this.authorsCount = res.payload.count
      this.isLoading = false
    } catch (e) {
      this.isLoading = false
    }
  }
  async addAuthor(e,callback) {
    this.btLoading = true
    try {
      let res = await fetch(api.getAuthor,{
        type: 'POST',
        data: JSON.stringify(e)
      })
      this.asynFeedback(true)
      this.btLoading = false
      this.authorsModal = false
      callback()
      this.getAuthorsData()
    } catch (e) {
      this.asynFeedback(false)
      this.btLoading = false
    }
  }
  async editAuthor(e,callback) {
    this.btLoading = true
    let id = this.authorsDetail.id
    try {
      let res = await fetch(api.getAuthor + `/` + id,{
        type:'PUT',
        data: JSON.stringify(e)
      })
      this.btLoading = false
      this.asynFeedback(true)
      callback()
      this.getAuthorsData()
    } catch (e) {
      this.asynFeedback(false)
      this.btLoading = false
    }
  }
  async getAuthorDetail(id) {
    this.isLoading = true
    this.authorsDetail = id
    this.isLoading = false
    this.showAddAuthor()
    // try {
    //   let res = await fetch(api.getAuthor + `/` + id)
    //   this.authorsDetail = res.payload
    //   this.isLoading = false
    //   this.showAddAuthor()
    // } catch (e) {
    //   this.isLoading = false
    // }
  }
  async deleteAuthor(e) {
    this.isLoading = true
    try {
      let res = await fetch(api.getAuthor + `/` + e,{
        type: 'DELETE'
      })
      this.asynFeedback(true)
      this.isLoading = false

      this.getAuthorsData()
    } catch (e) {
      this.asynFeedback(false)
      this.isLoading = false
    }
  }
  async getFieldFirstLevel(){
    //获取一级领域列表
    this.isLoading = true
    try {
      let res = await fetch(api.getField + `/firstLevel`)
      this.fieldsCount = res.payload.length
      res.payload.forEach((item) =>{
        this.getFieldTree(item.id,res.payload)
      })
      this.isLoading = false
    } catch (e) {
      this.isLoading = false
    }
  }
  async getFieldTree(e,data){
    //根据父级获取树形子级领域
    this.isLoading = true
    try {
      let res = await fetch(api.getField + `/` + e +`/childrenTree`)
      for(var i in data){
        if(data[i].id == e){
          data[i] = Object.assign({}, data[i], {children:res.payload})
        }
      }
      this.fields = data
      this.isLoading = false
    } catch (e) {
      this.isLoading = false
    }
  }
  async addField(e,id,callback) {
    let data
    if(id){
       data = {
        name: e.name,
        parentId: id
      }
    }else {
       data = e
    }
    this.btLoading = true
    try {
      let res = await fetch(api.getField,{
        type: 'POST',
        data: JSON.stringify(data)
      })
      this.asynFeedback(true)
      this.btLoading = false
      this.fieldsModal = false
      callback()
      this.getFieldFirstLevel()
    } catch (e) {
      this.asynFeedback(false)
      this.btLoading = false
    }
  }
  async editField(e,callback) {
    let id = this.fieldsDetail.id
    this.btLoading = true
    try {
      let res = await fetch(api.getField + '/' + id,{
        type: 'PUT',
        data: JSON.stringify(e)
      })
      this.asynFeedback(true)
      this.btLoading = false
      this.fieldsModal = false
      callback()
      this.getFieldFirstLevel()
    } catch (e) {
      this.asynFeedback(false)
      this.btLoading = false
    }
  }
  async getFieldDetail(e){
    this.fieldsDetail = e
    this.showAddField()
  }
  async deleteField(id) {
    this.isLoading = true
    try {
      let res = await fetch(api.getField + `/` + id,{
        type: 'DELETE'
      })
      this.asynFeedback(true)
      this.isLoading = false
      this.getFieldFirstLevel()
    } catch (e) {
      this.asynFeedback(false)
      this.isLoading = false
    }
  }
  async addThesis(e,callback) {
    this.btLoading = true
    try {
      let res = await fetch(api.articles,{
        type: 'POST',
        data: JSON.stringify(e)
      })
      this.asynFeedback(true)
      this.btLoading = false
      this.ThesisModal = false
      callback()
      this.getArticles()
    } catch (e) {
      this.asynFeedback(false)
      this.btLoading = false
    }
  }
  async getPeriodicals(e,data){
    //获取期刊
    this.isLoading = true
    let query = `?size=999&page=0`
    try {
      let res = await fetch(api.periodicals + query)
      this.periodicals = res.payload.rows
      this.isLoading = false
    } catch (e) {
      this.isLoading = false
    }
  }
  async searchFields(e){
    //获取一级领域列表
    this.isLoading = true
    this.fields = []
    try {
      let res = await fetch(api.getField + `/` + e)
      this.fieldsCount = 1
      this.fields.push(res.payload)
      this.isLoading = false
    } catch (e) {
      this.isLoading = false
    }
  }
  async searchAuthor(e) {
    let query = `?size=50&page=0&search=${e}`
    try {
      let res = await fetch(api.getAuthor + query)
      this.authors = res.payload.rows
      this.authorsCount = res.payload.count
    } catch (e) {
    }
  }
  cleanAuthor(){
    this.authors = []
  }
  setSearchParams (params) {
    this.search = params
  }
  setSelectKey(keys) {
    this.selectKeys = keys
  }
  setTaskData(obj) {
    const newData = Object.assign({}, this.taskDetail, obj)
    this.taskDetail = newData
  }
  // setCrossRouterParams (params = {}) {
  //   let newObj = Object.assign(this.crossRouterParams, params)
  //   this.crossRouterParams = newObj
  // }
  // resetCrossRouterParams() {
  //   this.crossRouterParams = {}
  // }
  resetPage() {
    this.page = {
      size: this.defaultSize,
      page: 1,
      count: 0,
    }
  }
  resetTask() {
    this.resetPage()
    this.selectKeys = []
    this.taskDetail = {
      remark: '',
      name: '',
      type: '',
      url: '',
    }
    this.taskResultDetail = {
      task: {}
    }
  }
  resetArticles() {
    //用来在各个页面的componentWillUnmount()中调用，初始化store的数据
    this.selectKeys = []
    this.closeUserModal()
    this.closeThesisModal()
    this.closeAuthorModal()
    this.closeFieldModal()
  }
  resetTaskModal() {
    this.taskDetail = {
      remark: '',
      name: '',
      type: '',
      url: '',
    }
    this.isLoading = false
  }
  showAddField(){
    this.fieldsModal = true
  }
  closeFieldModal(){
    this.fieldsDetail = {}
    this.fieldsModal = false
  }
  showModal() {
    this.isModalVisible = true
  }
  showScheduleModal(obj) {
    this.scheduleObj = obj
    this.isScheduleVisible = true
  }
  hideScheduleModal() {
    this.scheduleObj = {}
    this.isScheduleVisible = false
  }
  showCommonModalOk() {
    this.isCommonModalVisible = true
  }
  hideCommonModalCancel() {
    this.isCommonModalVisible = false
  }
  hideModal() {
    this.isModalVisible = false
    this.isLoading = false
  }
  asynFeedback(bool, msgObj) { // 异步操作反馈
    message.config({
      top: 300
    })
    if (bool) {
      message.success(msgObj && msgObj.successMsg || '操作成功!', 2)
    } else {
      message.error(msgObj && msgObj.failMsg || '操作失败!', 2)
    }
  }
  showAddUser() {
    this.UserModal = true
  }
  closeUserModal() {
    this.UserDetail = {}
    this.UserModal = false
  }
  showAddThesis() {
    this.ThesisModal = true
  }
  closeThesisModal() {
    this.ThesisModal = false
  }
  showAddAuthor() {
    this.authorsModal = true
  }
  closeAuthorModal() {
    this.authorsDetail = {}
    this.authorsModal = false
  }
}
