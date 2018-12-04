'use strict';

module.exports = app => {

  class UserTask extends app.Service {
    /**
     * [findTasksByUserId 查找关注的期刊]
     * @param  {[type]}  condition [description]
     * @return {Promise}           [description]
     */

    async findJournalNameByUserId(userId) {
      const condition = {
        where: {userId},
        attributes: ['name']

      }
      const utList = await this.ctx.model.UserTask.findAll(condition);
      const names = utList.map((ut) => {
        return ut.name;
      })
      return names;
    }

    /**
     * 更新上一次查看期刊的时间
     * @param userId
     * @param taskId
     * @returns {Promise<*>}
     */
    async updateLastReadTime(userId, taskId) {
      const condition = {
        where: {userId, taskId}
      }
      return await this.ctx.model.UserTask.update({lastReadTime: new Date()}, condition);
    }

    /**
     * 判断用户是否订阅了某个期刊
     * @param userId
     * @param taskId
     * @returns {Promise<void>}
     */
    async hasFollowTask(userId, taskId) {
      const condition = {
        where: {userId, taskId}
      }
      const count = await this.ctx.model.UserTask.count(condition);
      return count > 0 ? true : false;
    }

    /**
     * 查找关注的期刊(包括期刊的文章更新量)
     *
     *
     */
    async findUserJournalsWithUnReadCount(userId) {
      // const journalstr = this.array2inStr(journals);
      //
      // const lastReadTime = `select last_read_time from user_tasks where user_id = ${userId}`;
      // const unReadCount = `select count(id) as count,journal from articles where journal in (${journalstr})
      //   and id not in (${readArticleIds}) group by journal`;
      //
      // const count = await app.model.query(`${unReadCount}`, {type: app.model.QueryTypes.SELECT});
      // return count;

      // 文章发布时间>期刊最新阅读时间 (过滤条件放在left join,这样才不会过滤期刊)
      const joinTables = `select ut.id,ut.task_id as taskId,ut.user_id userId,ut.name,ut.type,ut.url,a.id as articleId
       from user_tasks ut left join articles a on ut.name=a.journal and ut.last_read_time < a.created_at `;
      const filterSQL = joinTables + ` where ut.user_id=${userId}`;
      const groupSQL = `select u.*,count(articleId) as unReadCount from (${filterSQL}) u group by u.name`;
      const userJournals = await app.model.query(groupSQL, {type: app.model.QueryTypes.SELECT});
      return userJournals;
    }

    /**
     * [createUserTask 关注期刊]
     * @param  {[type]}  userTask [description]
     * @return {Promise}          [description]
     */
    async createUserTask(userTask) {
      return await this.ctx.model.UserTask.create(userTask);
    }

    /**
     * 用户取消订阅的期刊
     * @param userId
     * @param taskId
     * @returns {Promise<*>}
     */
    async cancleFollowTask(userId, taskId) {
      const condition = {
        userId,
        taskId
      }
      return await this.ctx.model.UserTask.destroy({
        where: condition
      });

    }


  }

  return UserTask;


};
