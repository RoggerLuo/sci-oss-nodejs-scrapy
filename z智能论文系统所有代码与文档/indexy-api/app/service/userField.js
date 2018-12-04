'use strict';

module.exports = app => {

  const { in: opIn } = app.Sequelize.Op;

  class UserFieldService extends app.Service {


    /**
     * 分页获取用户关注的领域
     * @method findUserFields
     * @param  {[type]}  page {where:xx,offset:page*size,limit:size}
     * @return {Promise}      [description]
     */
    async findUserFields(page) {
      return await this.ctx.model.UserField.findAndCountAll(page);
    }

    async findByUserIdAndFieldId(userId, fieldId) {
      return await this.ctx.model.UserField.findAll({
        where: { userId, fieldId },
      });
    }

    async findByUserIdAndFieldIds(userId, fieldIds) {
      return await this.ctx.model.UserField.findAll({
        where: { userId, fieldId: { [opIn]: fieldIds } },
      });
    }

    // 查找用户关注的所有领域
    async findUserFieldsByUserId(userId) {
      return await this.ctx.model.UserField.findAll({
        where: {
          userId,
          isFollow: true,
        },
        include: { // 返回内容包含外键对象
          model: this.ctx.model.Field,
          as: 'field',
        },
      });
    }

    /**
   * [createUserField 新增用户领域关系(感兴趣/不感兴趣)]
   * @param  {[type]}  userField [description]
   * @return {Promise}            [description]
   */
    async createUserField(userField) {
      return await this.ctx.model.UserField.create(userField);
    }

    /**
     * [bulkCreateUserField 批量关注领域]
     * @param  {Array}   [userFields=[]] [description]
     * @return {Promise}                 [description]
     */
    async bulkCreateUserField(userFields = []) {
      return await this.ctx.model.UserField.bulkCreate(userFields);
    }


  }

  return UserFieldService;


};
