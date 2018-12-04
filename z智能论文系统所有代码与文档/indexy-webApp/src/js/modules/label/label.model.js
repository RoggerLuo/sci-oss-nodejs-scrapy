import {observable, action, runInAction} from 'mobx'
import Toast from 'antd-mobile/lib/toast'
import ErrorToast from "../../components/ErrorToast"
import fetch from '../../common/fetch'
import api from './api'
import {
  getCookie,
  getToken
} from '../../utils/cookies'

export default class {
  @observable label = []

  @action async getLabel() {
    //获取所有的标签
    let userId = getCookie("userID"),
      query = `?token=${getToken()}`
    try {
      let resp = await fetch(api.label(userId) + query)
      runInAction(() => {
        this.label = resp.payload
      })
    } catch (error) {}
  }
  @action async addLabel(e, callBack) {
    //新增标签
    let userId = getCookie("userID"),
      query = `?token=${getToken()}`,
      data = {
        name: e
      }
    try {
      let resp = await fetch(api.label(userId) + query, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
      })
      Toast.success('操作成功', 2)
      this.getLabel()
      callBack
    } catch (error) {
      ErrorToast(error, '操作失败')
    }
  }
  @action async editLabel(id, e, callBack) {
    //修改标签
    let userId = getCookie("userID"),
      query = `?token=${getToken()}`,
      data = {
        name: e
      }
    try {
      let resp = await fetch(api.label(userId) + `/${id}` + query, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PUT',
        data: JSON.stringify(data)
      })
      Toast.success('操作成功', 2)
      this.getLabel()
      callBack
    } catch (error) {
      ErrorToast(error,'操作失败')
    }
  }
  @action async delLabel(id) {
    //删除标签
    let userId = getCookie("userID"),
      query = `?token=${getToken()}`
    try {
      let resp = await fetch(api.label(userId) + `/${id}` + query, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'DELETE'
      })
      Toast.success('操作成功', 2)
      this.getLabel()
    } catch (error) {
      ErrorToast(error,'操作失败')
    }
  }
}
