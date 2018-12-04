'use strict';

module.exports = app => {

  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Author = app.model.define('author', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    realname: { type: STRING, allowNull: false, unique: true },
    nickname: { type: STRING },
    articleCount: { type: INTEGER, defaultValue: 0, field: 'article_count' }, // 文章量
    fans: { type: INTEGER, defaultValue: 0 }, // 粉丝量
    createdAt: {type: DATE, field: 'created_at'},
    updatedAt: {type: DATE, field: 'updated_at'},

  });

  return Author;
};
