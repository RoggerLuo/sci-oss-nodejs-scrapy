/**
 * Created by qingkong on 2017/12/4.
 */
import {observable, action, runInAction} from 'mobx'
import fetch from '../../common/fetch'

export default class DiscoveryStore{
  @observable ListData = this.data01
  @observable author = this.data02

  data01 = [
    {
      title: '广东海洋大学学报',
      remark: '影响因子：0.562',
    },
    {
      title: '广东农业科学',
      remark: '影响因子：0.562',
    },
    {
      title: '安徽农业科学',
      remark: '影响因子：0.562',
    },
    {
      title: '北方农业学报',
      remark: '影响因子：0.562',
    },
    {
      title: '华北农学报',
      remark: '影响因子：0.562',
    },
    {
      title: '天津农业科学',
      remark: '影响因子：0.562',
    },
    {
      title: '河北农业科学',
      remark: '影响因子：0.562',
    },
    {
      title: '中国农业科学',
      remark: '影响因子：0.562',
    },
    {
      title: '河南农业科学',
      remark: '影响因子：0.562',
    },
    {
      title: '中国农学通报',
      remark: '影响因子：0.562',
    }
  ]
  data02 = [
    {name:'安徒生',remark:'文章10 粉丝300'},
    {name:'姜新',remark:'文章2 粉丝18'},
    {name:'刘光辉',remark:'文章2 粉丝29'},
    {name:'陆玉英',remark:'文章3 粉丝34'},
    {name:'陆文科',remark:'文章5 粉丝40'},
    {name:'李一伟',remark:'文章2 粉丝13'},
    {name:'罗瑞鸿',remark:'文章3 粉丝24'},
    {name:'刘芸',remark:'文章3 粉丝18'},
    {name:'欧阳习田',remark:'文章7 粉丝62'},
    {name:'阮经宙',remark:'文章2 粉丝23'},
    {name:'王海军',remark:'文章5 粉丝41'},
    {name:'王力伟',remark:'文章3 粉丝33'},
    {name:'肖波',remark:'文章2 粉丝22'},
    {name:'姚雪梅',remark:'文章4 粉丝37'}
  ]

  @action reset(){
    this.ListData = this.data01
    this.author = this.data01
  }
}
