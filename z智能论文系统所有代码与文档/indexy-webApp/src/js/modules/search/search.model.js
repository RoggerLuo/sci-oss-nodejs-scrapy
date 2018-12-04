/**
 * Created by miffy on 2018/3/12.
 */
import { observable, action, runInAction } from 'mobx'
import fetch from '../../common/fetch'
import Toast from 'antd-mobile/lib/toast'
import api from './api'
import {getCookie, getToken } from '../../utils/cookies'

const userId = getCookie('userID')

export default class SearchStore {
  @observable searchType = '全部'
  @observable articles = []
  @observable articlesLoading = true
  @observable authors = []
  @observable authorsLoading = true
  @observable periodicals = []
  @observable periodicalsLoading = true
  @observable page = 0

  @action async searchArticals(searchValue,size,type) {
    runInAction(() => {
      this.articlesLoading = true
      if (type == "more") {
        this.page = this.page + 1
      } else {
        this.page = 0
      }
    })
    let query = `?page=${this.page}&size=${size}&search=${searchValue}`
    try {
      let resp = await fetch(api.articles(userId) + query)
      runInAction(() => {
        this.articles.unshift(...resp.payload.rows)
        this.articlesLoading = false
      })
    } catch(e) {
      runInAction(() => {
        this.articlesLoading = false
      })
    }
  }
  @action async searchAuthors(val,size) {
    runInAction(() => {
      this.authorsLoading = true
    })
    let query = `?page=0&size=${size}&search=${val}`
    try {
      let resp = await fetch(api.authors(userId) + query)
      runInAction(() => {
        this.authors = resp.payload.rows
        this.authorsLoading = false
      })
    } catch(e) {
      runInAction(() => {
        this.authorsLoading = false
      })
    }
  }
  @action async searchPeriodicals(val,size) {
    runInAction(() => {
      this.periodicalsLoading = true
    })
    let query = `?page=0&size=${size}&userId=${userId}&search=${val}`
    try {
      let resp = await fetch(api.periodicals + query)
      runInAction(() => {
        this.periodicals = resp.payload.rows
        this.periodicalsLoading = false
      })
    } catch(e) {
      runInAction(() => {
        this.periodicalsLoading = false
      })
    }
  }
  @action reset() {
    this.articles = []
    this.authors = []
    this.periodicals = []
    this.articlesLoading = true
    this.authorsLoading = true
    this.periodicalsLoading = true
  }
}
