'use strict';

module.exports = app => {

  class UserDisinclineService extends app.Service {

    /**
     * 判断用户是否已屏蔽了该篇文章
     * @param userId
     * @param articleId
     * @returns {Promise<boolean>}
     */
    async hasDisincline(userId, articleId) {
      const count = await this.ctx.model.UserDisincline.count({where: {userId, articleId}});
      return count > 0 ? true : false;
    }

    /**
     * [createUserDisincline 屏蔽文章
     * @param  {[type]}  userCollection [description]
     * @return {Promise}            [description]
     */
    async createUserDisincline(userCollection) {
      return await this.ctx.model.UserDisincline.create(userCollection);
    }

    /**
     * 根据用户id获取用户屏蔽的文章
     * @param userId
     * @returns {Promise<void>}
     */
    async findDisinclineArticleIdsByUserId(userId) {
      const disinclineArticles = await this.ctx.model.UserDisincline.findAll({
        where: {userId},
        attributes: ["articleId"]
      });
      const dArticleIds = disinclineArticles.map((dA) => {
        return dA.articleId;
      })
      return dArticleIds;
    }

  }

  return UserDisinclineService;


};
