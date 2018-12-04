Object.defineProperty(exports, "__esModule", {
  value: true,
})
function deleteCookie(name) {
  // if (process.env.BROWSER) {
    sessionStorage.removeItem(name)
  // }
}
function writeCookie(name, value, expiredays) {
  sessionStorage.setItem(name, value)
}

function getCookie(name) {
  // if (process.env.BROWSER) {
    return sessionStorage.getItem(name)
  // }
}

function getToken() {
  return getCookie('token')
}

function removeToken() {
  deleteCookie('token')
}

exports.deleteCookie = deleteCookie
exports.writeCookie = writeCookie
exports.getCookie = getCookie
exports.getToken = getToken
exports.removeToken = removeToken
