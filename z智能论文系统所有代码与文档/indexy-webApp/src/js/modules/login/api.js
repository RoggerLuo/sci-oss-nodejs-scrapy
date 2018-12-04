/**
 * Created by qingkong on 2017/11/23.
 */

const prefix = '/indexy_api'
const version = `${prefix}/api/v1`

const api = {
  login: `${version}/users/login`,
  register: `${version}/users/register`,
  isInterested: (userId) => `${version}/users/${userId}/hasFollowField`,
}

export default api
