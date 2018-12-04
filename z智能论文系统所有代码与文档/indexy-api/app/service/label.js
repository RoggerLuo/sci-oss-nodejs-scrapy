'use strict';

// http://docs.sequelizejs.com/class/lib/model.js~Model.html

module.exports = app => {

  const {in: opIn} = app.Sequelize.Op;

  class LabelService extends app.Service {
    /**
     * 分页获取收藏标签列表
     * @method findLabels
     * @param  {[type]}  page {where:xx,offset:page*size,limit:size}
     * @return {Promise}      [description]
     */
    async findLabels(page) {
      return await this.ctx.model.Label.findAndCountAll(page);
    }

    /**
     * [findList 查询所有收藏标签]
     * @param  {[type]}  userId [description]
     * @return {Promise}       [description]
     */
    async findListByUserId(userId) {
      return await this.ctx.model.CollectionLabel.findAll({where: {userId}});
    }

    /**
     * 根据id获取收藏标签
     * @method findLabelById
     * @param  {[type]}     id [description]
     * @return {Promise}       [description]
     */
    async findLabelById(id) {
      return await this.ctx.model.CollectionLabel.findById(id);
    }


    /**
     * 创建收藏标签
     * @method createLabel
     * @param  {[type]}   label [description]
     * @return {Promise}       [description]
     */
    async createLabel(label) {
      return await this.ctx.model.CollectionLabel.create(label);
    }


    /**
     * 根据id更新收藏标签
     * @method updateLabelById
     * @param  {[type]}       id      [description]
     * @param  {[type]}       updates [description]
     * @return {Promise}              [description]
     */
    async updateLabelById(id, updates) {
      return await this.ctx.model.CollectionLabel.update(updates, {
        where: {
          id,
        },
      });
    }


    /**
     * 根据id数组删除收藏标签
     * @method deleteLabelByIds
     * @param  {[type]}        ids [description]
     * @return {Promise}           [description]
     */
    async deleteLabelByIds(ids) {
      return await this.ctx.model.CollectionLabel.destroy({
        where: {
          id: {
            [opIn]: ids,
          },
        },
      });
    }

  }

  return LabelService;
};
