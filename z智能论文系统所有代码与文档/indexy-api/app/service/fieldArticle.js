'use strict';

module.exports = app => {

  class FieldArticleService extends app.Service {


    /**
     * 分页获取领域的文章
     * @method findFieldArticles
     * @param  {[type]}  page {where:xx,offset:page*size,limit:size}
     * @return {Promise}      [description]
     */
    async findFieldArticles(page) {
      return await this.ctx.model.FieldArticle.findAndCountAll(page);
    }

    /**
   * [createFieldArticle 新增用户领域关系(感兴趣/不感兴趣)]
   * @param  {[type]}  FieldArticle [description]
   * @return {Promise}            [description]
   */
    async createFieldArticle(FieldArticle) {
      return await this.ctx.model.FieldArticle.create(FieldArticle);
    }

  }

  return FieldArticleService;


};
