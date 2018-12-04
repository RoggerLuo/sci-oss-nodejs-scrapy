'use strict';

/**
 * 用户收藏标签表
 * @param app
 * @returns {void|*}
 */
module.exports = app => {

  const {STRING, INTEGER, DATE} = app.Sequelize;

  const CollectionLabel = app.model.define('collection_label', {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: STRING, allowNull: false},
    userId: {type: INTEGER, allowNull: false, field: 'user_id'},//用户id
    created_at: {type: DATE},
    updated_at: {type: DATE}
  });

  return CollectionLabel;
};
