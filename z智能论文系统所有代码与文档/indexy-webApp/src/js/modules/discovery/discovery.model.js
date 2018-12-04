/**
 * Created by qingkong on 2017/11/17.
 */
import {observable, action, runInAction} from 'mobx'
import fetch from '../../common/fetch'
import Toast from 'antd-mobile/lib/toast'
import ErrorToast from "../../components/ErrorToast"
import api from './api'
import {getCookie} from '../../utils/cookies'

export default class DiscoveryStore {
  @observable tabsPage = 0
  @observable rowsNum = 10
  @observable page = 0 //for artcicles
  @observable periodicalsPage = 0
  @observable authorPage = 0
  @observable isAuth = false
  @observable selectedDiscovery = 0
  @observable pickOne = '论文领域'
  @observable pickTwo = '收录杂志'
  @observable pickThree = '所获荣誉'
  @observable periodicals = []
  @observable articlesData = []
  @observable author = []
  @observable customsAuthor = []
  @observable authorDetail = {}
  @observable authorList = []
  @observable firstFields = []
  @observable secondFields = []
  @observable thirdFields = []
  @observable periodicalData = []
  @observable fieldDetail = {
    name: ''
  }
  @observable authorState = 0
  @observable articlesState = 0
  @observable authorLoading = false
  @observable periodicalLoading = false
  @observable articlesLoading = false
  @observable PeriodicalPage = 0
  @observable initCustom = [{
    type: 'keyword',
    exact: false,
    condi: 'and',
    value: ''
  }, {
    type: 'title',
    exact: false,
    condi: 'and',
    value: ''
  }, {
    type: 'abstract',
    exact: false,
    condi: 'and',
    value: ''
  }]
  @observable customTitle = ""
  @observable customList = []
  @observable customPage = 0
  @observable customLoading = false
  @observable periodicalDetail = {}
  @observable articleList = []
  @observable PDFs = ""
  @observable listPage = 0 //期刊列表
  @observable periodicalListLoading = false
  @observable topicArticlesLoading = false

  @action changePage(e) {
    this.tabsPage = e
  }
  @action sendCustomDetail(e, name) {
    this.initCustom = e
    this.customTitle = name
  }
  @action changeTab(value) {
    //点击跳转navbar
    this.selectedDiscovery = value
    switch (value) {
      case 0:
        this.pickOne = '论文领域'
        this.pickTwo = '收录杂志'
        this.pickThree = '所获荣誉'
        this.resetLoading()
        break;
      case 1:
        this.pickOne = '杂志领域'
        this.pickTwo = '期刊级别'
        this.pickThree = '影响因子'
        this.resetLoading()
        break;
      case 2:
        this.pickOne = '领域'
        this.pickTwo = '职业'
        this.pickThree = '荣誉'
        this.resetLoading()
        break;
    }
  }
  @action async getTopicsArticlesData(e, page) {
    //获取主题下的论文列表
    let id = getCookie("userID"),
      nextPage = page||page==0? page: this.page
    runInAction(() => {
      this.topicArticlesLoading = true
      if(nextPage!==this.page) {
        this.page = nextPage
      }
    })
    let  query = `?size=15&page=${nextPage}`
    try {
      let resp = await fetch(api.articles(id,e) + query)
      runInAction(() => {
        if (resp.payload.rows.length < 1) {
          this.articlesState = 2
        }
        if(page) {
          this.articlesData.push(...resp.payload.rows)
        }
        else {
          this.articlesData = resp.payload.rows
        }
        this.topicArticlesLoading = false
      })
    } catch (error) {
      runInAction(() => {
        this.articlesState = 1
        this.topicArticlesLoading = false
      })
    } finally {
      runInAction(() => {
        this.topicArticlesLoading = false
      })
    }
  }
  @action async getPeriodicals(page, searchValue, callback) {
    runInAction(() => {
      this.periodicalLoading = true
      if(page) {
        this.periodicalsPage = page
      }
    })
    let id = getCookie("userID"),
      assignPage = page||page==0 ? page : this.periodicalsPage
    let query = `?page=${assignPage}&size=${this.rowsNum}&userId=${id}&search=${searchValue?searchValue:''}`
    try {
      let resp = await fetch(api.periodicals + query, {showLoading:1 == assignPage})
      runInAction(() => {
        if (page) {
          this.periodicals.push(...resp.payload.rows)
        } else {
          this.periodicals = resp.payload.rows
        }
        this.periodicalLoading = false
      })
      callback&&callback()
    } catch (error) {
      runInAction(() => {
        this.periodicalLoading = false
      })
    }
  }
  @action async subscribe(method, id, callback) {
    let uid = getCookie("userID")
    try {
      let resp = await fetch(api.followPeriodical(uid, id), {
        method: method
      })
      runInAction(() => {
        if (resp.success) {
          Toast.success(resp.payload, 1)
          //两种情况的处理 一种是期刊详情 点击后btn的变化 还有就是 添加期刊点击后 btn的变化
          if(this.periodicals.length>0) {
            const row = this.periodicals.find((item) => id === item.journal.id)
            if(row){
              row.isFollow = !row.isFollow
            }
          }
          if(this.periodicalDetail) {
            let obj = this.periodicalDetail
            this.periodicalDetail.isFollow = !obj.isFollow
          }
          callback && callback(id, method, resp.success)
        } else {
          Toast.fail(resp.message, 1)
        }
      })
    } catch (error) {
      ErrorToast(error)
    }
  }
  @action async getAuthorData(page, searchValue, callback) {
    let id = getCookie("userID"),
      assignPage = page||page==0 ? page : this.authorPage
    runInAction(() => {
      this.authorLoading = true
      this.authorState = 0
      if(page) {
        this.authorPage = page
      }
    })
    let query = `?size=${this.rowsNum}&page=${assignPage}&search=${searchValue?searchValue:''}`
    try {
      let resp = await fetch(api.authors(id) + query, {showLoading:1 == assignPage})
      runInAction(() => {
        if (resp.payload.rows.length < 1) {
          this.authorState = 2
        }
        if (page) {
          this.author.push(...resp.payload.rows)
        } else {
          this.author = resp.payload.rows
        }
        this.authorLoading = false
      })
      callback&&callback()
    } catch (error) {
      runInAction(() => {
        this.authorState = 1
        this.authorLoading = false
      })
    }
  }
  @action async getFirstFields() {
    //获取首级领域
    try {
      let resp = await fetch(api.firstFields)
      runInAction(() => {
        this.firstFields = resp.payload
      })
    } catch (error) {
      ErrorToast(error, '获取感兴趣领域失败！请稍后再试!', 3)
    }
  }
  @action async getSecondFields(id) {
    //获取二级以下的领域树
    try {
      let resp = await fetch(api.secondFields(id))
      runInAction(() => {
        if (resp) {
          this.secondFields = resp.payload ? resp.payload : []
          this.thirdFields = resp.payload[0] ? resp.payload[0].children : []
        }
      })
    } catch (error) {
      ErrorToast(error, '获取感兴趣类型失败！请稍后再试!', 3)
    }
  }
  @action getThirdFields(id) {
    //获取第一个二级的三级领域选项
    //切换二级领域之后 获取新的三级领域选项
    let resp = this.secondFields.find((item) => item.id === id)
    this.thirdFields = resp.children ? resp.children : []
  }
  @action async getDetail(id) {
    //获取领域的相关信息
    try {
      let resp = await fetch(api.fieldDetail(id))
      runInAction(() => {
        this.fieldDetail = resp.payload
      })
    } catch (error) {
      ErrorToast(error, '获取感兴趣领域失败！请稍后再试!', 3)
    }
  }
  @action async sendFields(ids, callback) {
    //关注选中的领域
    let id = ids.join(','),
      userId = getCookie("userID")
    let obj = {
      userId: getCookie("userID"),
      fieldId: ids
    }
    if (ids.length > 0) {
      try {
        let resp = await fetch(api.followFields(userId, id), {
          data: JSON.stringify(obj),
          method: 'POST'
        })
        Toast.success('关注领域成功!正在转入首页', 3)
        callback && callback()
      } catch (error) {
        ErrorToast(error)
      }
    } else {
      callback && callback()
    }
  }
  @action async getPeriodicalData(type) {
    // 获取我订阅的期刊
    runInAction(() => {
      this.periodicalLoading = true
      if (type == "more") {
        this.PeriodicalPage = this.PeriodicalPage + 1
      } else {
        this.PeriodicalPage = 0
      }
    })
    let query = `?size=12&page=${this.PeriodicalPage}`,
      userId = getCookie("userID")
    try {
      let resp = await fetch(api.myPeriodicals(userId))
      //这里应该合并数据，才能在长列表中翻页时完整展示数据,
      //同时也能解决当下一页没有数据时，页面无数据展示的问题
      //else里面是对当前页面进行下拉刷新的的操作
      runInAction(() => {
        if (type == "more") {
          this.periodicalData.push(...resp.payload)
        } else {
          this.periodicalData = resp.payload
        }
        this.periodicalLoading = false
      })
    } catch (error) {
      runInAction(() => {
        this.periodicalLoading = false
      })
      ErrorToast(error)
    }
  }
  @action changeExact(type, checked) {
    //关注-添加定制 选择精确
    // let newArr = []
    this.initCustom.forEach((item) => {
      // let obj = {}
      if (item.type === type) {
        item.exact = checked

      } else {

      }
    })
    // this.initCustom = newArr
  }
  @action changeCondition(type, condition) {
    //关注-添加定制 选择过滤条件
    // let newArr = []
    this.initCustom.forEach((item) => {
      // let obj = {}
      if (item.type === type) {
        item.condi = condition
        // obj = {
        //   type: type,
        //   exact: item.exact,
        //   condi: condition
        // }
        // newArr.push(obj)
      } else {
        // obj = item
        // newArr.push(obj)
      }
    })
    // this.initCustom = newArr
  }
  @action changeValue(type, e) {
    //关注-添加定制 输入框
    if (type === 'name') {
      this.customTitle = e
    }
    this.initCustom.forEach((item) => {
      // let obj = {}
      if (item.type === type) {
        item.value = e
        // obj = {
        //   type: type,
        //   exact: item.exact,
        //   condi: condition
        // }
        // newArr.push(obj)
      } else {
        // obj = item
        // newArr.push(obj)
      }
    })
    // this.initCustom = newArr
  }
  @action async startCustom(callback) {
    //关注-添加定制 选择定制btn
    let userId = getCookie("userID")
    let data = {
      name: this.customTitle,
      abstract: {
        content: this.initCustom[2].value,
        operator: this.initCustom[2].condi,
        exact: this.initCustom[2].exact
      },
      keyword: {
        content: this.initCustom[0].value,
        operator: this.initCustom[0].condi,
        exact: this.initCustom[0].exact
      },
      title: {
        content: this.initCustom[1].value,
        operator: this.initCustom[1].condi,
        exact: this.initCustom[1].exact
      }
    }
    try {
      let resp = await fetch(api.customs(userId), {
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(data),
        method: 'POST'
      })
      Toast.success('操作成功',2)
      this.getCustom(0)
      runInAction(() => {
        this.initCustom = [
          {
            type: 'keyword',
            exact: false,
            condi: 'and',
            value: ''
          }, {
            type: 'title',
            exact: false,
            condi: 'and',
            value: ''
          }, {
            type: 'abstract',
            exact: false,
            condi: 'and',
            value: ''
          }
        ]
        this.customTitle = ''
      })
      callback && callback()
    } catch (error) {
      ErrorToast(error, '操作失败')
    }
  }
  @action async editCustom(tid, callback) {
    //关注-添加定制 选择定制btn 编辑
    let userId = getCookie("userID")
    let data = {
      name: this.customTitle,
      abstract: {
        content: this.initCustom[2].value,
        operator: this.initCustom[2].condi,
        exact: this.initCustom[2].exact
      },
      keyword: {
        content: this.initCustom[0].value,
        operator: this.initCustom[0].condi,
        exact: this.initCustom[0].exact
      },
      title: {
        content: this.initCustom[1].value,
        operator: this.initCustom[1].condi,
        exact: this.initCustom[1].exact
      }
    }
    try {
      let resp = await fetch(api.customs(userId)+`/${tid}`, {
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(data),
        method: 'PUT'
      })
      Toast.success('操作成功',2)
      this.getCustom(0)
      callback && callback()
    } catch (error) {
      ErrorToast(error, '操作失败')
    }
  }
  @action async getCustom(page) {
    //获取用户的主题定制列表
    let userId = getCookie("userID"),
      changedPage = page||page==0 ? page : 0,
      query = `?page=${changedPage}&size=${this.rowsNum}`
    runInAction(() => {
      this.customLoading = true
      this.customPage = changedPage
    })
    try {
      let resp = await fetch(api.customs(userId) + query)
      runInAction(() => {
        if(page) {
          this.customList.push(...resp.payload.rows)
        }
        else {
          this.customList = resp.payload.rows
        }
      })
    } catch (error) {
      ErrorToast(error, '获取失败')
    } finally {
      runInAction(() => {
        this.customLoading = false
      })
    }
  }
  @action async delCustom(id,callBack) {
    //删除指定定制
    let userId = getCookie("userID")
    try {
      let resp = await fetch(api.customs(userId)+`/${id}`, {
        method: 'DELETE'
      })
      Toast.success('操作成功',2)
      runInAction(() => {
        let newCustoms = this.customList.filter((item) => {return item.id !== id})
        this.customList = newCustoms
      })
      callBack?callBack&&callBack():null
    } catch (error) {
      ErrorToast(error, '操作失败')
    }
  }
  @action async getCustomAuthors(page) {
    //获取用户的作者关注列表
    let userId = getCookie("userID"),
      changedPage = page||page ==0 ? page: 0,
      query = `?page=${changedPage}&&size=${this.rowsNum}`
    runInAction(() => {
      this.authorPage = changedPage
      this.authorLoading = true
    })
    try {
      let resp = await fetch(api.myAuthors(userId) + query)
      runInAction(() => {
        if(page) {
          this.customsAuthor.push(...resp.payload.rows)
        }
        else {
          this.customsAuthor = resp.payload.rows
        }
        this.authorLoading = false
      })
    } catch (error) {
      runInAction(() => {
        this.authorLoading = false
      })
    }
  }
  @action async getAuthorDetail(id, callback) {
    //获取作者详情
    let userId = getCookie("userID")
    try {
      let resp = await fetch(api.authorDetail(userId, id))
      runInAction(() => {
        this.authorDetail = resp.payload
      })
      callback && callback(resp.success)
    } catch (error) {
      ErrorToast(error)
    }
  }
  @action async getAuthorList(id, callback, page) {
    //获取作者的文章列表
    let userId = getCookie("userID"),
      assignPage =page||page==0 ? page : this.listPage
    runInAction(() => {
      if(page) {
        this.listPage = page
      }
      this.articlesLoading = true
    })
    let query = `?size=10&page=${assignPage}`
    try {
      let resp = await fetch(api.authorList(userId,id) + query)
      runInAction(() => {
        if (page) {
          this.authorList.push(...resp.payload.rows)
        } else {
          this.authorList = resp.payload.rows
        }
        callback && callback(resp.success)
        this.articlesLoading = false
      })
    } catch (error) {
      runInAction(() => {
        this.articlesLoading = false
      })
    }
  }
  @action async getPeriodicalDetail(id, callback) {
    let userId = getCookie("userID")
    try {
      let resp = await fetch(api.periodicalDetail(userId, id))
      runInAction(() => {
        this.periodicalDetail = resp.payload
      })
      callback && callback(false)
    } catch (error) {
      ErrorToast(error, '获取期刊详情失败,请稍后再试')
    }
  }
  @action async getPeriodicalList(id, callback, page) {
    //获取期刊中的文章列表
    let uid = getCookie("userID"),
      assignPage =page||page==0 ? page : this.listPage
    runInAction(() => {
      this.periodicalListLoading = true
      if(page) {
        this.listPage = page
      }
    })
    let query = `?page=${assignPage}&size=${this.rowsNum}`
    try {
      let resp = await fetch(api.periodicalList(uid, id) + query)
      callback && callback(resp.success, id)
      runInAction(() => {
        if (page) {
          this.articleList.push(...resp.payload.rows)
        } else {
          this.articleList = resp.payload.rows
        }
        this.periodicalListLoading = false
      })
    } catch (error) {
      runInAction(() => {
        this.periodicalListLoading = false
      })
      ErrorToast(error, '获取期刊文章列表失败,请稍后再试')
    }
  }
  @action async followAuthor(id, method, callback) {
    let uid = getCookie("userID")
    try {
      let resp = await fetch(api.followAuthor(uid, id), {
        method: method
      })
      runInAction(() => {
        if (resp.success) {
          Toast.success(method === 'POST' ? '已关注成功' : '已成功取消关注', 1)
          if(this.author.length>0) {
            const row = this.author.find((item) => id === item.id)
            if(row){
              row.isFollow = !row.isFollow
            }
          }
          if(this.authorDetail) {
            let obj = this.authorDetail
            this.authorDetail.isFollow = !obj.isFollow
          }
          callback && callback(id, method, true)
        }
      })
    } catch (error) {
      ErrorToast(error)
    }
  }
  @action async loadingAll(id) {
    let uid = getCookie("userID")
    try {
      let resp = await fetch(api.loadPdf(uid,id), {
        method: "GET"
      })
      Toast.success("申请成功，正在处理,请等待一段时间")
    } catch (error) {
      ErrorToast(error)

    }
  }
  @action async getAuthorId(authorId,callBack) {
    let uid = getCookie("userID")
    try {
      let resp = await fetch(api.anthorId(uid,authorId), {
        method: "GET"
      })
      callBack&&callBack(resp.payload.id)
    } catch (error) {
      callBack()
    }
  }
  @action reset() {
    this.periodicalData = []
    this.customsAuthor = []
    this.isAuth = false
    this.selectedDiscovery = 0
    this.pickOne = '论文领域'
    this.pickTwo = '收录杂志'
    this.pickThree = '所获荣誉'
    this.periodicals = []
    this.articlesData = []
    this.author = []
    this.firstFields = []
    this.secondFields = []
    this.thirdFields = []
    this.fieldDetail = []
    this.page = 0 //for artcicles
    this.periodicalsPage = 0
    this.authorPage = 0
    this.authorPage = 0
    this.customPage = 0
    this.authorDetail = {}
    this.authorList = []
    this.periodicalDetail = {}
    this.articleList = []
    this.PDFs = ""
  }
  @action resetLoading() {
    this.authorLoading = true
    this.periodicalLoading = true
    this.articlesLoading = false
  }
}
