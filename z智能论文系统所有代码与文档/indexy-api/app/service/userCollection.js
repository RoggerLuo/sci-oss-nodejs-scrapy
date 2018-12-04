'use strict';

module.exports = app => {

  class UserCollectionService extends app.Service {

    /**
     * 查询用户收藏记录
     * @param userId
     * @param articleId
     * @returns {Promise<void>}
     */
    async findUserCollectionByUserIdAndArticleId(userId, articleId) {
      return await this.ctx.model.UserCollection.findOne({where: {userId, articleId}});
    }


    /**
     * 判断用户是否已收藏文章
     * @param userId
     * @param articleId
     * @returns {Promise<boolean>}
     */
    async hasCollection(userId, articleId) {
      const count = await this.ctx.model.UserCollection.count({where: {userId, articleId}});
      return count > 0 ? true : false;
    }

    /**
     * [createUserCollection 添加文章收藏
     * @param  {[type]}  userCollection [description]
     * @return {Promise}            [description]
     */
    async createUserCollection(userCollection) {
      return await this.ctx.model.UserCollection.create(userCollection);
    }

    /**
     * 根据id更新收藏分类或阅读状态
     * @method updateLabelById
     * @param  {[type]}       id      [description]
     * @param  {[type]}       updates [description]
     * @return {Promise}              [description]
     */
    async updateById(id, updates) {
      return await this.ctx.model.UserCollection.update(updates, {
        where: {
          id,
        },
      });
    }

    /**
     * 用户取消收藏文章
     * @param userId
     * @param articleId
     * @returns {Promise<*>}
     */
    async cancleFollowTask(userId, articleId) {
      const condition = {
        userId,
        articleId
      }
      return await this.ctx.model.UserCollection.destroy({
        where: condition
      });

    }

  }

  return UserCollectionService;


};
