'use strict';

/**
 * 用户-屏蔽文章表
 * @param app
 * @returns {void|*}
 */
module.exports = app => {

  const {STRING, INTEGER, DATE} = app.Sequelize;

  const UserDisincline = app.model.define('user_disincline', {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    userId: {type: INTEGER, allowNull: false, field: 'user_id'},
    articleId: {type: INTEGER, allowNull: false, field: 'article_id'},
    reason: {type: STRING},//屏蔽的原因
    created_at: {type: DATE},
    updated_at: {type: DATE}
  });

  return UserDisincline;
};
