'use strict';

// http://docs.sequelizejs.com/class/lib/model.js~Model.html

module.exports = app => {

  const {in: opIn} = app.Sequelize.Op;

  class TopicService extends app.Service {
    /**
     * 分页获取主题定制列表
     * @method findTopics
     * @param  {[type]}  page {where:xx,offset:page*size,limit:size}
     * @return {Promise}      [description]
     */
    async findTopics(page) {
      return await this.ctx.model.Topic.findAndCountAll(page);
    }

    /**
     * 获取用户的主题列表
     * @param userId
     * @returns {Promise<*>}
     */
    async findUserTopicList(userId) {
      return await this.ctx.model.Topic.findAll({where: {userId}});
    }

    /**
     * [findList 查询所有主题定制]
     * @param  {[type]}  userId [description]
     * @return {Promise}       [description]
     */
    // async findListByUserId(userId) {
    //   return await this.ctx.model.Topic.findAll({where: {userId}});
    // }

    /**
     * 根据id获取主题定制
     * @method findTopicById
     * @param  {[type]}     id [description]
     * @return {Promise}       [description]
     */
    async findTopicById(id) {
      return await this.ctx.model.Topic.findById(id);
    }


    /**
     * 创建主题定制
     * @method createTopic
     * @param  {[type]}   topic [description]
     * @return {Promise}       [description]
     */
    async createTopic(topic) {
      return await this.ctx.model.Topic.create(topic);
    }


    /**
     * 根据id更新主题定制
     * @method updateTopicById
     * @param  {[type]}       id      [description]
     * @param  {[type]}       updates [description]
     * @return {Promise}              [description]
     */
    async updateTopicById(id, updates) {
      return await this.ctx.model.Topic.update(updates, {
        where: {
          id,
        },
      });
    }


    /**
     * 根据id数组删除主题定制
     * @method deleteTopicByIds
     * @param  {[type]}        ids [description]
     * @return {Promise}           [description]
     */
    async deleteTopicByIds(ids) {
      return await this.ctx.model.Topic.destroy({
        where: {
          id: {
            [opIn]: ids,
          },
        },
      });
    }

  }

  return TopicService;
};
