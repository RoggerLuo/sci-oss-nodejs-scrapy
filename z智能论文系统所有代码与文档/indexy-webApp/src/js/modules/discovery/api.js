/**
 * Created by miffy on 2017/12/09.
 */

const prefix = '/indexy_api'
const version = `${prefix}/api/v1`

const api = {
  articles: (uid, id) => `${version}/users/${uid}/topics/${id}/articles`,
  periodicals: `${version}/tasks`,
  myPeriodicals: (userId) => `${version}/users/${userId}/userTasks`,
  periodicalDetail: (uid, id) => `${version}/users/${uid}/tasks/${id}`,
  periodicalList: (uid, id) => `${version}/users/${uid}/tasks/${id}/articles`,
  followPeriodical: (uid, id) => `${version}/users/${uid}/tasks/${id}`,
  getArtical: (id) => `${version}/articles/${id}/watch`,
  authors: (uid) => `${version}/users/${uid}/authors`,
  careFor: (userId) => `${version}/users/${userId}/follow/authors/`,
  firstFields: `${version}/fields/firstLevel`,
  secondFields: (id) => `${version}/fields/${id}/childrenTree`,
  fieldDetail: (id) => `${version}/fields/${id}`,
  followFields: (userId, id) => `${version}/users/${userId}/follow/fields/${id}`,
  customs: (userId) => `${version}/users/${userId}/topics`,
  myAuthors: (userId) => `${version}/users/${userId}/userAuthors`,
  authorDetail: (uid, id) => `${version}/users/${uid}/authors/${id}`,
  authorList: (uid,id) => `${version}/users/${uid}/authors/${id}/articles`,
  followAuthor: (uid, id) => `${version}/users/${uid}/authors/${id}`,
  pdf: (uid,id,status) => `${version}/users/${uid}/articles/${id}/pdf?download=${status}`,
  loadPdf: (uid,id) => `${version}/users/${uid}/articles/${id}/fulltext`,
  anthorId: (uid,name) => `${version}/users/${uid}/authors/${name}/id`,
  pdfUrl: url => `/articles/${url}`
}

export default api
