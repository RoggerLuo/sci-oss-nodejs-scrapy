'use strict';

module.exports = app => {

  const { in: opIn } = app.Sequelize.Op;

  class UserFieldService extends app.Service {


    /**
     * [deleteByFieldIds 删除包含某些领域的用户的关注记录]
     * @param  {[type]}  fieldIds [领域ids]
     * @return {Promise}          [description]
     */
    async deleteByFieldIds(fieldIds) {
      return await this.ctx.model.UserField.destroy({
        where: { fieldId: { [opIn]: fieldIds } },
      });
    }

    /**
     * 根据用户id删除用户关注的领域
     * @param userIds
     * @returns {Promise<*>}
     */
    async deleteByUserIds(userIds) {
      const condition = {
        where: {
          userId: {[opIn]: userIds}
        }
      }
      return await this.ctx.model.UserField.destroy(condition);
    }

  }

  return UserFieldService;


};
