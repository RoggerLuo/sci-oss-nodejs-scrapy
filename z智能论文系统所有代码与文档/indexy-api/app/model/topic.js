'use strict';

module.exports = app => {

  const {STRING, INTEGER, DATE, JSON} = app.Sequelize;

  const Topic = app.model.define('topic', {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: STRING, allowNull: false},
    userId: {type: INTEGER, allowNull: false, field: 'user_id'},
    title: {type: JSON}, //篇名
    keyword: {type: JSON}, //关键字
    abstract: {type: JSON}, //摘要
    created_at: {type: DATE},
    updated_at: {type: DATE},

  });

  return Topic;
};


/**
 {
    "id": 62241,
    "name": "1PBBAVw37I",//主题名称
    "userId": 62866, //用户id
    "title": { //篇名
        "content": "Z7gIXzSY1t",
        "operator": "and",// 操作，and:并且、or:或、notContain:不包含
        "exact": false //是否精确
    },
    "keyword": { //关键字
        "content": "v56JOvl9sp",
        "operator": "and",
        "exact": false
    },
    "abstract": { //摘要
        "content": "HN7cthO7rm",
        "operator": "and",
        "exact": false
    },
    "created_at": "1981-05-12 00:35:40",
    "updated_at": "2012-01-19 21:09:05"
}

 */