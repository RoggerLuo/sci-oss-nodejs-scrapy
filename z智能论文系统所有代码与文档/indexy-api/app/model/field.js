'use strict';

/**
 * [exports 领域-模型]
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */

module.exports = app => {

  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Field = app.model.define('field', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: STRING, allowNull: false, unique: true }, // 领域名称
    parentId: { type: INTEGER, field: 'parent_id' }, // 父级id
    created_at: { type: DATE },
    updated_at: { type: DATE },
  });

  return Field;

};
