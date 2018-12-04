/**
 * Created by qingkong on 2018/1/8
 */
import React from 'react'
import { withRouter } from 'react-router'
import { observer, inject } from 'mobx-react'
import List from 'antd-mobile/lib/list'
import image from '../../../images/discovery/58f60440480d8.png'
import ContentListItem from '../../components/content-list-item/ContentListItem'
import SwipeAction from 'antd-mobile/lib/swipe-action'
import Modal from 'antd-mobile/lib/modal'
import path from '../../app/path'

const Item = List.Item;
const alert = Modal.alert;

@withRouter
@inject("discovery")
@observer
export default class Fields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: document.documentElement.clientHeight
    };
  }
  componentDidMount() {
    const navbar = document.getElementsByClassName('am-navbar-right')[0].offsetHeight
    const footerBar = document.getElementsByClassName('footer-bar')[0].offsetHeight
    const tabs = document.getElementsByClassName('am-tabs-tab-bar-wrap')[0].offsetHeight
    const hei = document.documentElement.clientHeight - footerBar - navbar - tabs;
    this.timer = setTimeout(() => {
      this.setState({
        height: hei
      });
    }, 600);
  }
  componentWillUnmount() {
    //离开页面时，初始化数据
    this.timer && clearTimeout(this.timer)
  }
  render() {
    let { height } = this.state
    const data = [
      {
        title: '作物学',
        amount: '34980',
        id: 1
      },{
        title: '食品科学',
        amount: '14729',
        id: 2
      }
    ]
    return (
      <div className="fields" style={{ height: height }}>
        {
          data.length>0?
          <List>
            {
              data.length>0?data.map((item,index) => {
                return<SwipeAction
                  key={index}
                  style={{ backgroundColor: 'gray' }}
                  autoClose
                  right={[
                    {
                      text: '编辑',
                      // onPress: this.selectEdit.bind(this, 'edit', item),
                      style: { backgroundColor: '#6da7ff', color: '#ffffff', width: '2rem', height: '100%' },
                    },
                    {
                      text: '删除',
                      onPress: () => alert('删除', '确认要删除吗？', [
                        { text: '取消'},
                        { text: '确认',
                          // onPress: this.selectEdit.bind(this, 'delete', item.id)
                        },
                      ]),
                      style: { backgroundColor: '#CCCCCC', color: '#ffffff', width: '2rem', height: '100%' },
                    },
                  ]}
                >
                  <Item thumb={image} key={index}>
                    <ContentListItem type="fields" item={item} rowID={index}/>
                  </Item>
                </SwipeAction>
            }):null
            }
          </List>:null
        }
      </div>
    )
  }
}

