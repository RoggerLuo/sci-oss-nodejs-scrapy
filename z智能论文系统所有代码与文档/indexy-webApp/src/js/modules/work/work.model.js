/**
 * Created by qingkong on 2017/12/1.
 */
import {observable, action, runInAction} from 'mobx'
import fetch from '../../common/fetch'
import api from '../home/api'
import errorToast from '../../components/ErrorToast'
import {
  getCookie,
  getToken
} from '../../utils/cookies'

export default class work{
  @observable page = 0
  @observable rowsNum = 10
  @observable menuShow = false
  @observable selectedMenu = '1'
  @observable collection = [
    {
      title: '全部论文',
      count: '41',
    },{
      title: '未分类',
      count: '17',
    },{
      title: '水稻',
      count: '3',
    },{
      title: '马铃薯',
      count: '2',
    },{
      title: '食品科学',
      count: '5',
    },{
      title: 'QTL',
      count: '4',
    },{
      title: '农业',
      count: '10',
    },
  ]
  @observable collect = [
    {
      title: '暂不分类',
      count: '41',
    },{
      title: '已阅读',
      count: '17',
    },{
      title: '未阅读',
      count: '3',
    },{
      title: '马铃薯',
      count: '2',
    },{
      title: '食品科学',
      count: '5',
    },{
      title: 'QTL',
      count: '4',
    },{
      title: '农业',
      count: '10',
    },
  ]
  @observable note = [
    {
      name: '有',
      id: '1',
    },{
      name: '无',
      id: '0',
    }
  ]
  @observable status = [
    {
      name: '已读',
      id: 'read'
    },{
      name: '未读',
      id: 'unread'
    },
  ]
  @observable indexLoading = true
  @observable starArticles = []

  @action addCollect(e) {
    this.collect.push({ title: e, count:'0' })
  }
  @action add(type,e) {
    switch (type){
      case 'note':
        this.note.push({ title:e })
        break;
      case 'status':
        this.status.push({ title:e, count:'0' })
        break;
      case 'collection':
        this.collection.push({ title:e, count:'0' })
        break
    }
  }
  @action changeMenuDisplay() {
    //修改是否显示菜单状态
    let oldShow =  this.menuShow
    this.menuShow = !oldShow
  }
  @action changeMenu(menu) {
    //修改选中的分类
    this.selectedMenu = menu[0]
  }
  @action reset() {
    this.menuShow = false
    this.selectedMenu = '1'
  }
  @action async getStarArticles(status, label, page) {
    //分页获取用户收藏的文章列表
    let nextPage = page ||page == 0 ? page : this.page
    runInAction(() => {
      this.indexLoading = true
      if(page) {
        this.page = page
      }
    })
    let id = getCookie("userID"),
      query = `?size=${this.rowsNum}&page=${nextPage}&token=${getToken()}&labelId=${label}&status=${status}`
    try {
      let resp = await fetch(api.userCollections(id) + query)
      runInAction(() => {
        if(page) {
          this.starArticles.push(...resp.payload.rows)
        }
        else {
          this.starArticles = resp.payload.rows
        }
      })
    } catch(e) {
      errorToast(e)
    } finally {
      runInAction(() => {
        this.indexLoading = false
      })
    }
  }
}
