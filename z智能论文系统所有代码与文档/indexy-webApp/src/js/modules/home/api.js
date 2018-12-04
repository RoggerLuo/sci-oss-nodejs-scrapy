/**
 * Created by qingkong on 2017/11/23.
 */

const prefix = '/indexy_api'
const version = `${prefix}/api/v1`

const api = {
  disincline: (userId) => `${version}/users/${userId}/userDisincline`,
  recommend: (userId) => `${version}/users/${userId}/articles`,
  // recommend: (userId) => `${version}/users/${userId}/articles/recommend`,
  articles: (userId) => `${version}/users/${userId}/index/articles`,
  periodicals: (userId) => `${version}/users/${userId}/follow/tasks/articles`,
  authors: (userId) => `${version}/users/${userId}/authors/articles`,
  article: (userId,id) => `${version}/users/${userId}/articles/${id}`,
  fields: (userId) => `${version}/users/${userId}/fields/articles`,
  selectedFields: (userId) => `${version}/users/${userId}/fields`,
  userCollections: (userId) => `${version}/users/${userId}/userCollections`,
  collect: (userId) => `${version}/users/${userId}/userCollections`,
  label: (userId) => `${version}/users/${userId}/labels`,
}

export default api
