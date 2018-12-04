'use strict';

/**
 * 用户收藏表
 * @param app
 * @returns {void|*}
 */
module.exports = app => {

  const {STRING, INTEGER, DATE, ENUM} = app.Sequelize;

  const UserCollection = app.model.define('user_collection', {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    userId: {type: INTEGER, allowNull: false, field: 'user_id'},
    articleId: {type: INTEGER, allowNull: false, field: 'article_id'},
    labelIds: {type: STRING, field: 'label_ids'},//分类id
    status: {type: ENUM, values: ['unread', 'read'], defaultValue: 'unread'},//unread:未读,read:已读
    created_at: {type: DATE},
    updated_at: {type: DATE}
  });

  return UserCollection;
};
