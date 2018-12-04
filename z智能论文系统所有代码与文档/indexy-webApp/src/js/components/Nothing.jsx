/**
 * Created by qingkong on 2018/3/20
 */
import React from 'react'
import Button from 'antd-mobile/lib/button'
import Img from '../../images/nothing@2x.png'

const Nothing = (props) => {
  const { onClick, btnText, emptyText } = props
  return (
    <div className="nothing">
      <img src={Img}/>
      <div className="text">{emptyText}</div>
      { onClick && <Button type="primary" className="go-add" onClick={onClick}>{btnText}</Button>}
    </div>
  )
}

Nothing.defaultProps = {
  btnText: "立即添加",
  emptyText: "什么都没有哦~"
}

export default Nothing
