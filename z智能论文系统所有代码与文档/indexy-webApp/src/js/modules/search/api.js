const prefix = '/indexy_api'
const version = `${prefix}/api/v1`

const api = {
  articles : (uid) => `${version}/users/${uid}/articles`,
  authors: (uid) => `${version}/users/${uid}/authors`,
  periodicals: `${version}/tasks`
}
export default api