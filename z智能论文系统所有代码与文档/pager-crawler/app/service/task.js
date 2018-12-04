'use strict';

// http://docs.sequelizejs.com/class/lib/model.js~Model.html

module.exports = app => {

  const { in: opIn } = app.Sequelize.Op;

  class Task extends app.Service {

    /**
     * 分页获取任务列表
     * @method findTasks
     * @param  {[type]}  page {where:xx,offset:page*size,limit:size}
     * @return {Promise}      [description]
     */
    async findTasks(page) {
      return await this.ctx.model.Task.findAndCountAll(page);
    }

    // 查询所有期刊
    async findList(condition) {
      return await this.ctx.model.Task.findAll(condition);
    }


    /**
     * 根据id获取任务
     * @method findTaskById
     * @param  {[type]}     id [description]
     * @return {Promise}       [description]
     */
    async findTaskById(id) {
      return await this.ctx.model.Task.findById(id);
    }


    /**
     * 创建任务
     * @method createTask
     * @param  {[type]}   task [description]
     * @return {Promise}       [description]
     */
    async createTask(task) {
      return await this.ctx.model.Task.create(task);
    }


    /**
     * 根据id更新任务
     * @method updateTaskById
     * @param  {[type]}       id      [description]
     * @param  {[type]}       updates [description]
     * @return {Promise}              [description]
     */
    async updateTaskById(id, updates) {
      return await this.ctx.model.Task.update(updates, {
        where: {
          id,
        },
      });
    }


    /**
     * 根据id数组删除任务
     * @method deleteTaskByIds
     * @param  {[type]}        ids [description]
     * @return {Promise}           [description]
     */
    async deleteTaskByIds(ids) {
      return await this.ctx.model.Task.destroy({
        where: {
          id: {
            [ opIn ]: ids,
          },
        },
      });
    }

    /**
     * 根据fields字段配置爬取文章首条数据  任务预览
     * [previewResult description]
     * @param  {[type]}  fields [description]
     * @return {Promise}        [description]
     */
    async previewResult(fields) {
      return await this.ctx.service.scraper.getDemoResult(fields);
    }

  }

  return Task;
};
