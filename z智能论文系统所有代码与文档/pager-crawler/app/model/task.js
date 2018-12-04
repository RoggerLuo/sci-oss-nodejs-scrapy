'use strict';

module.exports = app => {

  const { STRING, INTEGER } = app.Sequelize;

  const Task = app.model.define('task', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: STRING, allowNull: false, unique: true },
    type: { type: STRING, allowNull: false },
    options: STRING, // json字符串
    fields: { type: STRING, allowNull: false }, // json字符串
    url: { type: STRING, allowNull: false, validate: { isUrl: true } }, // http://foo.com
    remark: STRING,
  });

  return Task;

};
