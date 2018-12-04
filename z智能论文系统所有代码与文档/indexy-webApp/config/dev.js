const development = {

  staticUrl: "",
  proxies:[
    {
      api: '/indexy_api',
      target: 'http://139.129.20.182:3004'
    },
    {
      api: '/articles',
      target: 'http://139.129.20.182:3004'
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
  },

}

module.exports = development
