'use strict';

const sequelize = require('./sequelize-db.js');

const {STRING, INTEGER, DATE,BOOLEAN} = sequelize.Sequelize;

const Article = sequelize.define('article', {
  id: {type: INTEGER, primaryKey: true, autoIncrement: true},

  taskResult_id: {type: INTEGER, allowNull: false}, // 任务结果，FK

  title: {type: STRING, allowNull: false, unique: true},
  summary: {type: STRING, allowNull: false},
  author: {type: STRING, allowNull: false},
  authorEmail: {type: STRING, allowNull: true, validate: {isEamil: true}}, // 作者邮箱

  keywords: STRING, // 关键词
  tags: STRING, // 标签
  publisher: STRING, // 出版社
  journal: STRING, // 期刊
  sourceUrl: {type: STRING, allowNull: false, validate: {isUrl: true}}, // http://foo.com
  pdfUrl: {type: STRING, allowNull: true}, // pdf的地址
  // finishedDownload: {type: BOOLEAN},//pdf是否已经完成下载
  publishTime: {type: DATE, allowNull: false},
  watch: {type: INTEGER, defaultValue: 0},
  doiCode: {type: STRING}, //doi码,TODO 后期设置为不能为空
  createdAt: {type: DATE, field: 'created_at'},
  updatedAt: {type: DATE, field: 'updated_at'},
});

module.exports = Article;
