'use strict';
/**
 * [exports 由于一篇文章包含多个领域,一个领域有多篇文章,多对多采用中间表更好管理]
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
// module.exports = app => {
//
//   const { INTEGER, DATE } = app.Sequelize;
//
//   const FieldArticle = app.model.define('field_article', {
//     id: { type: INTEGER, primaryKey: true, autoIncrement: true },
//
//     fieldId: { type: INTEGER, allowNull: false, field: 'field_id' }, // FK
//     articleId: { type: INTEGER, allowNull: false, field: 'article_id' }, // FK
//
//     publishTime: { type: DATE, allowNull: false, field: 'publish_time' }, // 文章的发布时间
//     created_at: { type: DATE },
//     updated_at: { type: DATE },
//   });
//
//   // 外键关联
//   FieldArticle.associate = () => {
//     app.model.FieldArticle.belongsTo(app.model.Field, { as: 'field', foreignKey: 'fieldId' });
//     app.model.FieldArticle.belongsTo(app.model.Article, { as: 'article', foreignKey: 'articleId' });
//   };
//
//   return FieldArticle;
//
// };
