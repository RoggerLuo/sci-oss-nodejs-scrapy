'use strict';

// Restful Api 加载形式，详见：
// https://eggjs.org/zh-cn/basics/router.html
/**
 * 用户文章收藏管理相关api
 */

const lodash = require('lodash');


module.exports = app => {
  // const { in: opIn } = app.Sequelize.Op;

  class CollectionController extends app.Controller {

    /**
     * 分页获取用户收藏的文章列表
     * @returns {Promise<void>}
     */
    //GET /api/v1/users/:userId/userCollections
    async findPageArticlesByUserCollection({page = 0, size = 10}) {
      this.logger.info(`分页获取用户收藏的文章列表 :${JSON.stringify(this.ctx.query)}`);

      const userId = this.ctx.params.userId;
      const query = this.ctx.query;
      const status = query.status;
      const labelId = query.labelId;
      if (query.page) page = +query.page;
      if (query.size) size = +query.size;

      this.ctx.body = await this.service.article.findPageArticlesByUserCollection(userId, status, labelId, page, size);
    }

    /**
     * 添加文章收藏
     * @returns {Promise<void>}
     */
    //POST /api/v1/users/:userId/userCollections
    async addUserCollection() {
      this.logger.info(`添加文章收藏 :${JSON.stringify(this.ctx.request.body)}`);

      const userId = this.ctx.params.userId;
      const body = this.ctx.request.body;

      if (!body.articleId) this.ctx.throw(400, `添加文章收藏失败,articleId不能为空`);

      //已收藏不能再收藏
      const hasCollection = await this.service.userCollection.hasCollection(userId, body.articleId);
      if (hasCollection) this.ctx.throw(400, `用户已收藏该文章`);

      if (!body.labelIds || body.labelIds.length == 0) {//array=>string
        delete body.labelIds;
      } else {
        body.labelIds = body.labelIds.toString();
      }
      try {
        body.userId = userId;
        this.ctx.body = await this.service.userCollection.createUserCollection(body);
      } catch (e) {
        this.ctx.throw(500, `添加文章收藏失败:${e.message}`);
      }

    }

    /**
     * 修改收藏文章的分类和阅读状态
     * @returns {Promise<void>}
     */
    //PUT /api/v1/users/:userId/userCollections
    async updateCollection() {
      this.logger.info(`编辑文章收藏分类或修改阅读状态 :${JSON.stringify(this.ctx.request.body)}`);

      const userId = this.ctx.params.userId;
      const body = this.ctx.request.body;

      if (!body.articleId) this.ctx.throw(400, `编辑文章收藏分类或修改阅读状态失败,articleId不能为空`);

      const uCollection = await this.service.userCollection.findUserCollectionByUserIdAndArticleId(userId, body.articleId);
      if (body.labelIds && body.labelIds.length > 0) {
        body.labelIds = body.labelIds.toString();
      }

      try {
        this.ctx.body = await this.service.userCollection.updateById(uCollection.id, body);
      } catch (e) {
        this.ctx.throw(500, `编辑文章收藏分类或修改阅读状态失败:${e.message}`);
      }

    }

    /**
     * 用户取消文章收藏
     * @returns {Promise<void>}
     */
    //DELELTE /api/v1/users/:userId/userCollections
    async cancelUserCollection() {
      this.logger.info(`取消文章收藏 :${JSON.stringify(this.ctx.request.body)}`);

      const userId = this.ctx.params.userId;
      const articleId = this.ctx.request.body.articleId;

      if (!articleId) this.ctx.throw(400, `取消文章收藏失败,articleId不能为空`);
      try {
        this.ctx.body = await this.service.userCollection.cancleFollowTask(userId, articleId);
      } catch (e) {
        this.ctx.throw(500, `取消文章收藏失败:${e.message}`);
      }

    }

  }

  return CollectionController;
};
