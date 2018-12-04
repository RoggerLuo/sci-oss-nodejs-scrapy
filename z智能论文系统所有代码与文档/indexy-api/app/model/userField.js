'use strict';

// 用户作者关注关系表

module.exports = app => {

  const { INTEGER, BOOLEAN, DATE } = app.Sequelize;

  const UserField = app.model.define('user_field', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: INTEGER, allowNull: false, field: 'user_id' },
    fieldId: { type: INTEGER, allowNull: false, field: 'field_id' },
    isFollow: { type: BOOLEAN, defaultValue: true, field: 'is_follow' }, // true:感兴趣,false:不感兴趣
    created_at: { type: DATE },
    updated_at: { type: DATE },
  });

  // 外键关联;
  UserField.associate = () => {
    app.model.UserField.belongsTo(app.model.User, { as: 'user', foreignKey: 'userId' });
    app.model.UserField.belongsTo(app.model.Field, { as: 'field', foreignKey: 'fieldId' });
  };

  return UserField;
};
