import { writeCookie, getToken, getCookie } from './cookies'

export const checkLogin = (nextState, replace) => {
  if (!getToken()) {
    var currPath = nextState.location.pathname
    var tmp = currPath.split('/')
    var path ='/login'
    replace(path)
    return false
  }
  return true
}