'use strict';

const Sequelize = require('sequelize');
const sequelize = require('./sequelize-db');

const { STRING, DATE, INTEGER } = Sequelize;

const Task = sequelize.define('task', {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: STRING, allowNull: false, unique: true },
  type: { type: STRING, allowNull: false },
  options: STRING, // json字符串
  fields: { type: STRING, allowNull: false }, // json字符串
  url: { type: STRING, allowNull: false, validate: { isUrl: true } }, // http://foo.com
  remark: STRING,
  createdAt: { type: DATE, field: 'created_at' }, // 采用直接new Sequelize()的方式默认sql插入的字段为createdAt,需要跟egg默认的created_at适配
  updatedAt: { type: DATE, field: 'updated_at' },
});

module.exports = Task;
