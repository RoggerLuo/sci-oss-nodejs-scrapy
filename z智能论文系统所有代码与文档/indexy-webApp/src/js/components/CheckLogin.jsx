//该组件用于判断有无登录
import React from 'react'
import {Route, Redirect, Switch} from 'react-router-dom'
import WithFooter from '../frame/WithFooter'
import path from '../app/path'
import {getToken} from '../utils/cookies'

const CheckLogin = (props) => {
  const { children, location } = props

  return (
    getToken() ?
      "/" === location.pathname ?
        <Redirect to={path.home.url}/>
      :
        <WithFooter>{props.children}</WithFooter>
    :
      <Redirect
        to={{
          pathname: path.login.url,
          state: { from: props.location }
        }}
      />
  )
}

export default CheckLogin
