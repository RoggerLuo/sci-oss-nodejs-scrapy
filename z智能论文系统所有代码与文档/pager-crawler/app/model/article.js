'use strict';

/**
 * [exports 文章]
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 *
 * 文章 通过 作者名称，领域名称,期刊名称与其他表关联
 */
module.exports = app => {

  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Article = app.model.define('article', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },

    taskResult_id: { type: INTEGER, allowNull: true }, // 任务结果，FK,手动录入的文章可为null

    title: { type: STRING, allowNull: false, unique: true },
    summary: { type: STRING, allowNull: false },
    author: { type: STRING, allowNull: false },
    authorEmail: { type: STRING, allowNull: true, validate: { isEamil: true } }, // 作者邮箱
    keywords: STRING, // 关键词
    tags: STRING, // 标签
    publisher: STRING, // 出版社
    journal: STRING, // 期刊
    sourceUrl: { type: STRING, allowNull: true, validate: { isUrl: true } }, // http://foo.com
    pdfUrl: { type: STRING, allowNull: true, validate: { isUrl: true } }, // pdf的地址
    watch: { type: INTEGER, defaultValue: 0 },
    publishTime: { type: DATE, allowNull: false },
    doiCode: {type: STRING}, //doi码,TODO 后期设置为不能为空
    downloadCount:{type: INTEGER, defaultValue: 0},//文章下载量
    created_at: { type: DATE },
    updated_at: { type: DATE },
  });

  // 外键关联
  // Article.associate = () => {
  //   app.model.Article.belongsTo(app.model.TaskResult, { as: 'taskResult', foreignKey: 'taskResult_id' });
  // };

  return Article;

};
