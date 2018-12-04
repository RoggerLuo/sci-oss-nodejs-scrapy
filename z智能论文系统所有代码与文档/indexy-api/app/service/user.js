'use strict';

// http://docs.sequelizejs.com/class/lib/model.js~Model.html

module.exports = app => {

  const { in: opIn } = app.Sequelize.Op;

  class User extends app.Service {

    /**
     * 分页获取用户列表
     * @method findUsers
     * @param  {[type]}  page {where:xx,offset:page*size,limit:size}
     * @return {Promise}      [description]
     */
    async findUsers(page) {
      return await this.ctx.model.User.findAndCountAll(page);
    }

    /**
     * [findList 查询所有用户]
     * @param  {[type]}  query [description]
     * @return {Promise}       [description]
     */
    async findList(query) {
      return await this.ctx.model.User.findAll(query);
    }

    /**
     * 根据id获取用户
     * @method findUserById
     * @param  {[type]}     id [description]
     * @return {Promise}       [description]
     */
    async findUserById(id) {
      return await this.ctx.model.User.findById(id);
    }


    /**
     * 创建用户
     * @method createUser
     * @param  {[type]}   User [description]
     * @return {Promise}       [description]
     */
    async createUser(User) {
      return await this.ctx.model.User.create(User);
    }


    /**
     * 根据id更新用户
     * @method updateUserById
     * @param  {[type]}       id      [description]
     * @param  {[type]}       updates [description]
     * @return {Promise}              [description]
     */
    async updateUserById(id, updates) {
      return await this.ctx.model.User.update(updates, {
        where: {
          id,
        },
      });
    }


    /**
     * 根据id数组删除用户
     * @method deleteUserByIds
     * @param  {[type]}        ids [description]
     * @return {Promise}           [description]
     */
    async deleteUserByIds(ids) {
      return await this.ctx.model.User.destroy({
        where: {
          id: {
            [ opIn ]: ids,
          },
        },
      });
    }

  }

  return User;
};
