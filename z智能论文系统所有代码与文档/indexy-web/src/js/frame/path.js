const prefix = ''
const path = {
  // login: {
  //   url: "/login",
  //   label: "登录"
  // },
  // index: {
  //   index: {
  //     url: "/dashboard",
  //     label: "首页"
  //   }
  // },
  tasks: {
    index: {
      url: prefix + '/tasks',
      label: '期刊',
    }
  },
  taskResult: {
    index: {
      url: prefix + '/tasks/result',
      label: '任务结果',
    }
  },
  crawler: {
    index: {
      url: prefix + '/crawler',
      label: '爬虫',
    }
  },
  thesisManagement: {
    index: {
      url: prefix + '/thesis-management',
      label: '论文管理',
    }
  },
  knowledgeGraph: {
    index: {
      url: prefix + '/knowledge-graph',
      label: '知识图谱',
    }
  },
  usersManagement: {
    index: {
      url: prefix + '/users-management',
      label: '用户管理',
    }
  },
  authorsManagement: {
    index: {
      url: prefix + '/authors-management',
      label: '作者管理'
    }
  },
  fieldsManagement: {
    index: {
      url: prefix + '/fields-management',
      label: '领域管理'
    }
  }
}
export default path
