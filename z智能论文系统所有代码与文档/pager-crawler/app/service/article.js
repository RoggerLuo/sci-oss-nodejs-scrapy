'use strict';
// http://docs.sequelizejs.com/class/lib/model.js~Model.html

module.exports = app => {

  const {in: opIn} = app.Sequelize.Op;

  class Article extends app.Service {

    /** http://docs.sequelizejs.com/manual/tutorial/instances.html#working-in-bulk-creating-updating-and-destroying-multiple-rows-at-once-
     *  批量插入文章
     * @method bulkCreateArticles
     * @param  {[type]}     Article_array [description]
     * @return {Promise}         [description]
     */
    async bulkCreateArticles(Article_array = []) {
      return await this.ctx.model.Article.bulkCreate(Article_array);
    }


    /**
     *  创建文章
     * @method createArticle
     * @param  {[type]}      article [description]
     * @return {Promise}             [description]
     */
    async createArticle(article) {
      return await this.ctx.model.Article.create(article);
    }

    /**
     * 分页获取文章列表
     * @method findArticles
     * @param  {[type]}      page: {where:xx,offset:page*size,limit:size}
     * @return {Promise}         [description]
     */
    async findArticles(page) {
      return await this.ctx.model.Article.findAndCountAll(page);
    }


    /**
     * 根据作者名称统计文章量
     * @param author
     * @returns {Promise<void>}
     */
    async countByAuthor(author) {
      const count = await app.model.query(`select count(*) as count from articles
        where concat(',',author,',') regexp concat(',(',replace('${author}',',','|'),'),')`,
        {type: app.model.QueryTypes.SELECT});
      return count && count.length > 0 ? count[0].count : 0;
    }


    /**
     * 根据id获取文章
     * @method findArticleById
     * @param  {[type]}        id [description]
     * @return {Promise}          [description]
     */
    async findArticleById(id) {
      return await this.ctx.model.Article.findById(id);
    }

    /**
     * 根据期刊名称获取文章ids
     * @returns {Promise<void>}
     */
    async findArticleIdsByJournal(name) {
      const condition = {
        where: {
          journal: name
        },
        attributes: ["id"]
      }
      const articles = await this.ctx.model.Article.findAll(condition);
      const ids = !articles ? [] : articles.map((a) => {
        return a.id;
      });
      return ids;
    }


    /**
     * 根据id更新文章
     * @method updateArticleById
     * @param  {[type]}          id      [description]
     * @param  {[type]}          updates [description]
     * @return {Promise}                 [description]
     */
    async updateArticleById(id, updates) {
      return await this.ctx.model.Article.update(updates, {
        id,
      });
    }


    /**
     * 根据期刊名称数组删除文章
     * @method deleteArticleByIds
     * @param  {[type]}           ids id集合
     * @return {Promise}              [description]
     */
    async deleteArticleByJournal(name) {
      return await this.ctx.model.Article.destroy({
        where: {
          journal: name
        },
      });
    }

    async deleteArticleByIds(ids) {
      return await this.ctx.model.Article.destroy({
        where: {
          id: {[opIn]: ids}
        },
      });
    }

  }

  return Article;
};
