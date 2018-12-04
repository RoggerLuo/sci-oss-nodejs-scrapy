
import {observable, action, runInAction} from 'mobx'
import fetch from '../../common/fetch'

const msgList = [
  {
    name: '鼓励师米肥',
    last: '可以的，你拿去用吧',
    time: '20：31',
    widge: '1'
  },{
    name: '学习小组',
    last: '好吧。。。',
    time: '20：33',
    widge: '2'
  },{
    name: '沈其荣',
    last: '你可以上网搜搜',
    time: '18：32',
    widge: '1'
  },{
    name: '金雨琦',
    last: '您好！我想咨询一下减肥的事宜。',
    time: '17：09',
    widge: '0'
  },{
    name: '陈邵文',
    last: '已发送邮箱，请查收',
    time: '17：00',
    widge: '0'
  },{
    name: '胡栋',
    last: '我超喜欢这里的~',
    time: '16：48',
    widge: '0'
  },{
    name: '何耀文',
    last: '周末请你吃火锅',
    time: '16：30',
    widge: '0'
  },{
    name: '圆圆',
    last: '哈哈哈，厉害',
    time: '16：09',
    widge: '0'
  },{
    name: '黄志华',
    last: '我试试',
    time: '15：57',
    widge: '0'
  },
]
export default class message{
  @observable msgList = msgList
}
