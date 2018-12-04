const development = {

  staticUrl: "",

  proxies:[
    {
      api: '/indexy_api',
      target: 'http://139.129.20.182:3004'
    }
    ],

  // 描述前端有多少个entry
  entries: {
    'index': `./src/js/app/index.jsx`,
  }

}

module.exports = development