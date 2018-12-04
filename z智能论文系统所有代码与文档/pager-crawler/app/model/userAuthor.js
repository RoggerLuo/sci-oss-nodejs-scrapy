'use strict';

// 用户作者关注关系表

module.exports = app => {

  const { INTEGER, BOOLEAN, DATE, STRING } = app.Sequelize;

  const UserAuthor = app.model.define('user_author', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: INTEGER, allowNull: false, field: 'user_id' },
    authorId: { type: INTEGER, allowNull: false, field: 'author_id' },
    authorName: { type: STRING, allowNull: false, field: 'author_name' },
    isFollow: { type: BOOLEAN, defaultValue: true, field: 'is_follow' }, // true:感兴趣,false:不感兴趣
    created_at: { type: DATE },
    updated_at: { type: DATE },
  });

  // 外键关联;
  UserAuthor.associate = () => {
    app.model.UserAuthor.belongsTo(app.model.User, { as: 'user', foreignKey: 'userId' });
    app.model.UserAuthor.belongsTo(app.model.Author, { as: 'author', foreignKey: 'authorId' });
  };

  return UserAuthor;
};
