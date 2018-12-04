"use strict";

const scrapeIt = require("scrape-it");

// Promise interface
scrapeIt("http://www.notulaebotanicae.ro/index.php/nbha/article/view/4726", {
  "title": "#articleTitle h3",
  "author": {
    "selector": "#authorString em",
    "convert": function(x){ return x?x:""},
    "trim": true
  },
  "keywords": {
    "selector": ".keywords .value",
    "convert":function(x){ return x?x:""},
    "how": "text",
    "trim": true
  },
  "summary": {
    "selector": "#articleAbstract>div>p",
    "convert": function(x){ return x?x:""},
    "trim": true
  },
  "publishTime": {
    "selector": ".time",
    "convert": function(x){ return x?x:null},
  },
  "doiCode": {
    "selector": "#pub-id::doi",
    "attr": "href"
  }
}).then(page => {
  console.log(page);
});

