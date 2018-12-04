'use strict';

module.exports = app => {

  const {in: opIn} = app.Sequelize.Op;

  class UserCollectionService extends app.Service {

    /**
     * 根据用户id删除用户收藏记录
     * @param userIds
     * @returns {Promise<*>}
     */
    async deleteByUserIds(userIds) {
      const condition = {
        where: {
          userId: {[opIn]: userIds}
        }
      }
      return await this.ctx.model.UserCollection.destroy(condition);
    }

    /**
     * 根据文章ids删除用户的收藏记录
     * @param articleIds
     * @returns {Promise<*>}
     */
    async deleteByArticleIds(articleIds) {
      //避免大于1000
      const groupArr = this.groupByLength(articleIds, 1000);
      for (let i = 0; i < groupArr.length; i++) {
        await this.ctx.model.UserCollection.destroy({
          where: {
            articleId: {[opIn]: groupArr[i]}
          }
        });
      }
      return true;
    }

    /**
     * 对数组按长度分组
     * @param array
     * @param length
     * @returns {Array}
     */
    groupByLength(array = [], length) {
      const groupArr = [];
      if (array.length > length) {
        for (let i = 0; i < Math.ceil(array.length / length); i++) {
          groupArr[i] = array.slice(i * length, (i + 1) * length);
        }
        return groupArr;
      }
      groupArr[0] = array;
      return groupArr;
    }

  }

  return UserCollectionService;


};
