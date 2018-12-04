const development = {

  staticUrl: "",

  proxies:[
    {
      api: '/crawler',
      target: 'http://localhost:7002'
    },
    {
      api: '/indexy_api',
      target: 'http://localhost:3004'
    }
    ],

  // 描述后端是如何匹配URL，以及hbs模板
  routes: {
    '/*': {
      view: 'index',
      scripts: ['vendors', 'index'],
      csses:['vendors']
    }
  },
  // 描述前端有多少个entry
  entries: {
    'index': `./src/js/app/index.jsx`,
  }

}

module.exports = development
