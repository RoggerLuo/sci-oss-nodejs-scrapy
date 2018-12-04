const prefix = '/crawler'
const users = '/indexy_api'

const api = {
  tasks: `${prefix}/api/v1/tasks`,
  tasksReult: `${prefix}/api/v1/taskResults`,
  articles: `${prefix}/api/v1/articles`,
  taskPreView: `${prefix}/api/v1/tasks/preview`,
  schedule: id => `${prefix}/api/v1/tasks/${id}/schedule`,
  getUser: `${prefix}/api/v1/users`,
  getAuthor: `${prefix}/api/v1/authors`,
  getField: `${prefix}/api/v1/fields`,
  periodicals: `${prefix}/api/v1/tasks/names`,
  // tasks: `${prefix}/api/v1/users`
}

export default api
