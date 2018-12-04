'use strict';

// http://docs.sequelizejs.com/class/lib/model.js~Model.html

module.exports = app => {

  const { in: opIn } = app.Sequelize.Op;

  class FieldService extends app.Service {
    /**
     * 分页获取领域列表
     * @method findFields
     * @param  {[type]}  page {where:xx,offset:page*size,limit:size}
     * @return {Promise}      [description]
     */
    async findFields(page) {
      return await this.ctx.model.Field.findAndCountAll(page);
    }

    /**
     * [findList 查询所有领域]
     * @param  {[type]}  query [description]
     * @return {Promise}       [description]
     */
    async findList(query) {
      return await this.ctx.model.Field.findAll(query);
    }

    /*
     * [buildFieldTree 根据父级id构建领域树]
     * @param  {[type]} List   [description]
     * @param  {[type]} String [description]
     * @return {[type]}        [description]
     */
    async buildFieldTree(allFields, parentId) {
      if (!allFields || allFields.length === 0) {
        return null;
      }
      const sonList = [];
      for (let i = 0; i < allFields.length; i++) {
        const field = allFields[i];
        if ((!parentId && !field.parentId) || (parentId && parentId === field.parentId)) {
          const sonChildList = await this.buildFieldTree(allFields, field.id);
          // ps:使用Object.assign({}, field)方法获取nField会抛出异常：Converting circular structure to JSON
          // 因此改用直接赋值
          // const nField = Object.assign({}, field);
          const nField = {};
          nField.id = field.id;
          nField.name = field.name;
          nField.parentId = field.parentId;
          nField.created_at = field.created_at;
          nField.updated_at = field.updated_at;

          nField.children = sonChildList;
          sonList.push(nField);
        }
      }
      if (sonList.length === 0) {
        return null;
      }
      return sonList;
    }

    /**
     * 根据id获取领域
     * @method findFieldById
     * @param  {[type]}     id [description]
     * @return {Promise}       [description]
     */
    async findFieldById(id) {
      return await this.ctx.model.Field.findById(id);
    }


    /**
     * 创建领域
     * @method createField
     * @param  {[type]}   field [description]
     * @return {Promise}       [description]
     */
    async createField(field) {
      return await this.ctx.model.Field.create(field);
    }


    /**
     * 根据id更新领域
     * @method updateFieldById
     * @param  {[type]}       id      [description]
     * @param  {[type]}       updates [description]
     * @return {Promise}              [description]
     */
    async updateFieldById(id, updates) {
      return await this.ctx.model.Field.update(updates, {
        where: {
          id,
        },
      });
    }


    /**
     * 根据id数组删除领域
     * @method deleteFieldByIds
     * @param  {[type]}        ids [description]
     * @return {Promise}           [description]
     */
    async deleteFieldByIds(ids) {
      return await this.ctx.model.Field.destroy({
        where: {
          id: {
            [ opIn ]: ids,
          },
        },
      });
    }

  }

  return FieldService;
};
