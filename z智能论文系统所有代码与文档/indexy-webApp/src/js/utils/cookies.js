'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteCookie = deleteCookie;
exports.writeCookie = writeCookie;
exports.getCookie = getCookie;
exports.getToken = getToken;
exports.removeToken = removeToken;

function deleteCookie(name) {
  if (process.env.BROWSER) {
    sessionStorage.removeItem(name);
  }
}
function writeCookie(c_name, value, expiredays) {
  sessionStorage.setItem(c_name, value);
}

function getCookie(c_name) {
  // if (process.env.BROWSER) {
    return sessionStorage.getItem(c_name);
  // }
}

function getToken() {
  return getCookie('token');
}

function removeToken() {
  deleteCookie('token');
}
