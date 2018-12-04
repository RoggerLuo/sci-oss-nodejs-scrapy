const resultState = {
  Delayed: '延迟',
  Queued: '排队',
  Active: '活动',
  Canceled: '取消',
  Succeed: '成功',
  Failure: '失败',
}
const defaultFileds = [
  {
    "items": {
      "listItem": "ol li a",
      "data": {
        "url": {
          "selector": "",
          "attr": "href",
          "convert": "new Function('x' , 'return \"http://www.cqvip.com\" + x')"
        }
      }
    }
  },
  {
    "items": {
      "listItem": "ul em",
      "data": {
        "url": {
          "selector": "a",
          "attr": "href",
          "convert": "new Function('x' , 'return \"http://www.cqvip.com\" + x')"
        }
      }
    }
  },
  {
    "title": ".detailtitle h1",
    "author": {
      "selector": "span.detailtitle > strong > i ",
      "convert": " new Function('x' , 'return x.split(\"|\")[1].split(\"   \")[0];')",
      "trim": true
    },
    "keywords": {
      "selector": ".datainfo.f14 > tr:nth-child(2) > td:nth-child(2)",
      "how": "text",
      "trim": true
    },
    "summary": {
      "selector": ".datainfo.f14:nth-child(1)",
      "convert": "new Function('x' , 'return !x ? \"\" : x.split(\"摘　要：\")[1]')",
      "trim": true
    },
    "publishTime": {
      "selector": "span.detailtitle > strong > i",
      "convert": "new Function('x' , 'return new Date ( x.split(\"|\")[0].replace(/[^0-9 ]/ig,\"\") )')"
    }
  }
]
const defaultOptions = {
  task_opts: {
    schedule: true,
    cron: '* * * * * *'
  },
  crawler_opts: {
    retries: 5,   // 重试（每个请求）
    concurrency: 2, // 并发（每个请求）
    delay: 0, //延迟（同一层同时可发送的请求）
    timeout: 10000 //超时（每个请求）
  },
  nats_opts: {
  
  }
}
export { resultState, defaultFileds, defaultOptions }
