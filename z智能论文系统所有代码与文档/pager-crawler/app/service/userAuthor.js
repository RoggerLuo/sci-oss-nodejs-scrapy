'use strict';

module.exports = app => {

  const {in: opIn} = app.Sequelize.Op;

  class UserAuthorService extends app.Service {


    /**
     * [deleteByFieldIds 删除包含用户关注的某些作者记录]
     * @param  {[type]}  authorIds [作者ids]
     * @return {Promise}          [description]
     */
    async deleteByAuthorIds(authorIds) {
      return await this.ctx.model.UserAuthor.destroy({
        where: {authorId: {[opIn]: authorIds}},
      });
    }

    /**
     * 根据用户id删除用户关注的作者
     * @param userIds
     * @returns {Promise<*>}
     */
    async deleteByUserIds(userIds) {
      const condition = {
        where: {
          userId: {[opIn]: userIds}
        }
      }
      return await this.ctx.model.UserAuthor.destroy(condition);
    }


  }

  return UserAuthorService;


};
