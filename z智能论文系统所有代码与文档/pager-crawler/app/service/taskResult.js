'use strict';

// http://docs.sequelizejs.com/class/lib/model.js~Model.html

module.exports = app => {

  const {in: opIn} = app.Sequelize.Op;

  class TaskResult extends app.Service {

    /**
     * 分页获取任务结果列表
     * @method findTaskResults
     * @param  {[type]}        page : {where:xx,offset:page*size,limit:size}
     * @return {Promise}            [description]
     */
    async findTaskResults(page) {
      return await this.ctx.model.TaskResult.findAndCountAll(page);
    }


    /**
     * 根据id获取任务结果
     * @method findTaskResultById
     * @param  {[type]}  id :{ where:{ id:id}, include:{model: this.ctx.model.Task,as:"task"} }
     * @return {Promise} [description]
     */
    async findTaskResultById(id) {
      const condition = {
        where: {
          id,
        },
        include: {
          model: this.ctx.model.Task,
          as: 'task',
        },
        attributes: ['id', 'task_id', 'state', 'description', 'created_at', 'updated_at'],
      };
      return await this.ctx.model.TaskResult.findOne(condition);
    }


    async findIdsByTaskIds(taskIds) {
      const condition = {
        where: {
          taskId: {[opIn]: taskIds},
        },
        attributes: ['id'],
      };
      const taskResults = await this.ctx.model.TaskResult.findAll(condition);
      const ids = taskResults.map((t) => {
        return t.id;
      })
      return ids;
    }


    /**
     * 创建任务结果
     * @method createTaskResult
     * @param  {[type]}         taskId 任务id
     * @return {Promise}               [description]
     */
    async createTaskResult(taskId) {
      const taskResult = {
        task_id: taskId,
        state: this.ctx.model.TaskResult.Queued,
      };
      return await this.ctx.model.TaskResult.create(taskResult);
    }


    /**
     * 根据id更新任务结果
     * @method updateTaskResultById
     * @param  {[type]}             id      [description]
     * @param  {[type]}             updates [description]
     * @return {Promise}                    [description]
     */
    async updateTaskResultById(id, updates) {
      return await this.ctx.model.TaskResult.update(updates, {
        where: {id},
      });
    }


    /**
     * 根据id数组删除任务结果
     * @method deleteTaskResultByIds
     * @param  {[type]}              ids [description]
     * @return {Promise}                 [description]
     */
    async deleteTaskResultByIds(ids) {
      return await this.ctx.model.TaskResult.destroy({
        where: {
          id: {
            [opIn]: ids,
          },
        },
      });
    }

    /**
     * 根据任务id删除任务结果
     * @param taskIds
     * @returns {Promise<void>}
     */
    async deleteByTaskIds(taskIds) {
      return await this.ctx.model.TaskResult.destroy({
        where: {
          task_id: {
            [opIn]: taskIds,
          },
        },
      });
    }

  }

  return TaskResult;
};
