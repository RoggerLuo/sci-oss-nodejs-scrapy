'use strict';

module.exports = app => {

  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: STRING, allowNull: false, unique: true },
    password: { type: STRING, allowNull: false },
    photo: { type: STRING },
    nickname: { type: STRING, allowNull: false },
    job: { type: STRING },
    school: { type: STRING },
    mobile: { type: STRING, is: /^(13\d|14[57]|15[^4,\D]|17[13678]|18\d)\d{8}|170[0589]\d{7}$/i, unique: true },
    email: { type: STRING, validate: { isEmail: true } },
    introduct: { type: STRING },
    token: { type: STRING },
    created_at: { type: DATE },
    updated_at: { type: DATE },

  });

  return User;

};
