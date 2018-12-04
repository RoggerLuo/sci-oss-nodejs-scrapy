'use strict';

module.exports = app => {

  const {in: opIn} = app.Sequelize.Op;

  class UserTask extends app.Service {

    /**
     * 删除某个期刊下的订阅信息
     * @param taskIds
     * @returns {Promise<*>}
     */
    async deleteByTaskIds(taskIds) {
      const condition = {
        taskId: {[opIn]: taskIds}
      }
      return await this.ctx.model.UserTask.destroy({
        where: condition
      });

    }

    /**
     * 根据用户id删除用户关注的期刊
     * @param userIds
     * @returns {Promise<*>}
     */
    async deleteByUserIds(userIds) {
      const condition = {
        where: {
          userId: {[opIn]: userIds}
        }
      }
      return await this.ctx.model.UserTask.destroy(condition);
    }
  }

  return UserTask;


};
