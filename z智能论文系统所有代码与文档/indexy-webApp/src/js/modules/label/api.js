/**
 * Created by qingkong on 2017/11/23.
 */

const prefix = '/indexy_api'
const version = `${prefix}/api/v1`

const api = {
  label: (userId) => `${version}/users/${userId}/labels`,
}

export default api
