
import {observable, useStrict, action, runInAction} from 'mobx'
import fetch from '../../common/fetch'
import api from './api'
import Toast from 'antd-mobile/lib/toast'
import ErrorToast from "../../components/ErrorToast"
import {getCookie, getToken} from '../../utils/cookies'

useStrict(true)
export default class home{
  @observable indexLoading = false
  @observable menuShow = false
  @observable selectedMenu = '1'
  @observable fieldsData = []
  @observable periodicalData = []
  @observable recommendData = []
  @observable authorData = []
  @observable page = 0
  @observable authorPage = 0
  @observable PeriodicalPage = 0
  @observable articleDetail = {}
  @observable articleLabel = {}
  @observable selectedFields = []
  @observable editClassification = {}
  @observable authorState = 0
  @observable authorLoading = true
  @observable periodicalLoading = true
  @observable fieldsLoading = true
  @observable recommendLoading = true
  @observable label = []

  changeMenuDisplay() {
    //修改是否显示菜单状态
    let oldShow =  this.menuShow
    this.menuShow = !oldShow
  }
  changeMenu(menu) {
    //修改选中的分类
    this.selectedMenu = menu[0]
  }
  @action async getPeriodicalData() {
    // 文章详情-相似文献
    // 首页 - 第一部分文章
    // 以上两种情况 都只需要三篇文章 所以 size为3
    runInAction(() => {
      this.indexLoading = true
    })
    let query = `?size=3&page=0`,
      userId = getCookie("userID")
      try {
        let resp = await fetch(api.articles(userId) + query)
        runInAction(() => {
          this.periodicalData = resp.payload
          this.indexLoading = false
        })
      } catch(error) {
        runInAction(() => {
          this.indexLoading = false
        })
      }
  }
  @action async getRecommendData(type) {
    // 首页-为您推荐 只需要两篇文章
    runInAction(() => {
      this.recommendLoading = true
    })
    let query = `?size=2&page=${0}`,
      userId = getCookie("userID")
      try {
        let resp = await fetch(api.recommend(userId) + query)
        runInAction(() => {
          this.recommendData = resp.payload.rows
          this.recommendLoading = false
        })
      } catch(error) {
        runInAction(() => {
          this.recommendLoading = false
        })
      }
  }
  @action async userDisincline(id,e) {
    //用户屏蔽文章
    let query = `?size=10&page=${this.PeriodicalPage}`,
      userId = getCookie("userID"),
      data = {
        articleId: id,
        reason: e
    }
    try {
      let resp = await fetch(api.disincline(userId) + query,{
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        data: JSON.stringify(data)
      })
      Toast.success('操作成功')
      this.getPeriodicalData()
    } catch(error) {
      ErrorToast(error)
    }
  }
  @action async getArticle(id, callback) {
    //获取文章详情
    const userId = getCookie('userID')
    try {
      let resp = await fetch(api.article(userId,id))
      runInAction(() => {
        this.articleDetail = resp.payload
      })
    } catch(error) {
      ErrorToast(error,'获取文章详情失败，请稍后再试')
    }
  }
  @action async getFields() {
    //获取已关注的领域
    let userId = getCookie("userID")
    try {
      let resp = await fetch(api.selectedFields(userId))
      runInAction(() => {
        this.selectedFields = resp.payload
      })
    } catch(error) {
      ErrorToast(error)
    }
  }
  @action async addCollect(method,id,e,status,callBack) {
    //添加、修改文章收藏
    let uid = getCookie("userID"),
      query = `?token=${getToken()}`
    let data = {
      articleId: id,
      labelIds: e,
      status: status
    }
    try {
      let resp = await fetch(api.collect(uid) + query,{
        headers: {'Content-Type': 'application/json'},
        method: method,
        data: JSON.stringify(data)
      })
      Toast.success('操作成功', 2)
      this.getArticle(id)
      callBack
    } catch(error) {
      ErrorToast(error,'操作失败')
    }
  }
  @action async delCollect(id) {
    //取消文章收藏
    let uid = getCookie("userID"),
      query = `?token=${getToken()}`
    let data = {
      articleId: id
    }
    try {
      let resp = await fetch(api.collect(uid) + query,{
        headers: {'Content-Type': 'application/json'},
        method: 'DELETE',
        data: JSON.stringify(data)
      })
      Toast.success('取消收藏成功', 2)
      this.getArticle(id)
    } catch(error) {
      ErrorToast(error,'操作失败')
    }
  }
  @action sendClassification(e) {
    this.editClassification = e
  }
  @action sendArticleDetail(e) {
    //从详情页面进入论文分类时，用来保存论文的信息
    this.articleLabel = e
  }
  @action reset() {
    this.PeriodicalPage = 0
    this.authorPage = 0
    this.page = 0
    this.fieldsData = []
    this.authorData = []
    this.articleDetail = {}
    this.authorState = 0
    this.label = []
    this.authorLoading = true
    this.periodicalLoading = true
    this.fieldsLoading = true
  }
}
