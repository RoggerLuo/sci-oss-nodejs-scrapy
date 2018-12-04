'use strict';

module.exports = app => {

  const {notIn} = app.Sequelize.Op;


  class UserTaskController extends app.Controller {


    /**
     * 分页获取期刊列表:关注--》期刊---》添加期刊页面的列表信息
     * @param page
     * @param size
     * @returns {Promise<void>}
     */
    // GET: /api/v1/tasks?userId=xxx
    // 需要用户id 来确定该期刊是否已订阅
    async index({page = 0, size = 10}) {
      const query = this.ctx.query;
      const userId = query.userId;
      if (!userId) this.ctx.throw(400, 'userId不能为空，请稍后重试...');
      try {
        if (query.page) page = +(query.page);
        if (query.size) size = +query.size;
        this.ctx.body = await this.service.task.findTasks(userId, query.search, {offset: page * size, limit: size});

      } catch (err) {
        this.ctx.throw(500, `分页查询期刊，请稍后重试... ${err.message}`);
      }
    }

    /**
     * 获取期刊详情
     * @returns {Promise<void>}
     */
    // GET: /api/v1/users/:userId/tasks/:id
    async findTaskById() {
      this.logger.info(`查看期刊详情:${JSON.stringify(this.ctx.params)}`);

      const userId = +this.ctx.params.userId;
      const taskId = +this.ctx.params.id;
      this.ctx.body = await this.service.task.findTaskById(taskId);

      const isFollow = await this.service.userTask.hasFollowTask(userId, taskId);
      this.ctx.body.setDataValue('isFollow', isFollow);

      //更新期刊的阅读时间，用于统计期刊更新文章量
      if (isFollow) {
        await this.service.userTask.updateLastReadTime(userId, taskId);
      }
    }

    /**
     * 获取用户的定制期刊列表
     * @returns {Promise<void>}
     */
    //GET /api/v1/users/:uid/userTasks
    async getUserJournalList() {
      // const query = this.ctx.query;
      const userId = +this.ctx.params.userId;
      try {
        // const results = await this.service.userTask.findTasksByUserId(userId);
        //
        // //期刊文章未读数
        // const journals = results.map((res => {//期刊名称
        //   return res.name;
        // }))
        //
        // if (journals && journals.length > 0) {
        //   const unReadCounts = await this.service.userTask.findUnReadCountOfFollowJournal(userId, journals);
        //   const unReadCountMap = {};
        //   unReadCounts.forEach((journal) => {
        //     unReadCountMap[journal.journal] = journal.count;
        //   })
        //
        //   //返回model中不存在的字段
        //   results.forEach(ut => {
        //     ut.setDataValue('unReadCount', unReadCountMap[ut.name] || 0);
        //   })
        //   this.ctx.body = results;
        // } else {
        //   this.ctx.body = [];
        // }

        this.ctx.body = await this.service.userTask.findUserJournalsWithUnReadCount(userId);

      } catch (err) {
        this.ctx.throw(err.status || 500, `获取用户的定制期刊列表异常:... ${err.message}`);
      }
    }


    /**
     * 分页获取用户订阅的某个期刊定制的文章列表
     * @param page
     * @param size
     * @param orders
     * @returns {Promise<void>}
     */
    //GET /api/v1/users/:userId/tasks/:taskId/articles
    async getJournalArticles({page = 0, size = 10, orders = ['publishTime,desc']}) {
      const userId = +this.ctx.params.userId;
      const taskId = +this.ctx.params.taskId;

      const query = this.ctx.query;
      if (query.page) page = +query.page;
      if (query.size) size = +query.size;
      if (this.ctx.queries.order) orders = this.ctx.queries.order; // ["id,desc", "name,asc"]

      //TODO 为了演示，只能先把有pdf的放在前面咯,后面去掉喔
      orders = ['pdfUrl,desc', 'publishTime,desc'];
      const ords = orders.map(item => {
        return item.trim().split(',');
      }); // e.g. [[ "id", "desc" ], ["name", "asc"]]
      this.logger.debug(ords);

      const condition = {
        offset: page * size,
        limit: size,
        order: ords,
        where: {},
        attributes: ["id", "title", "author", "journal", "publishTime"]
      };

      const task = await this.service.task.findTaskById(taskId);
      if (!task) {
        this.ctx.throw(400, `获取用户的定制期刊列表异常,不存在期刊id::${taskId}`);
      }

      //去掉用户屏蔽的文章
      const dArticleIds = await this.service.userDisincline.findDisinclineArticleIdsByUserId(userId);
      if (dArticleIds.length > 0) {
        condition.where.id = {[notIn]: dArticleIds}
      }

      try {
        condition.where.journal = task.name;
        this.ctx.body = await this.service.article.findArticles(condition);
      } catch (e) {
        this.ctx.throw(err.status || 500, `获取用户的定制期刊列表异常:... ${err.message}`);
      }
    }


    /**
     * 添加期刊定制:关注期刊
     * @returns {Promise<void>}
     */
    // POST: /api/v1/users/:userId/tasks/:taskId/
    async follow() {
      try {
        const userId = +this.ctx.params.userId;
        const taskId = +this.ctx.params.taskId;

        const hasfollow = await this.service.userTask.hasFollowTask(userId, taskId);
        if (hasfollow) this.ctx.throw(400, `用户已经订阅了改期刊，不能再继续订阅`);

        const task = await this.service.task.findTaskById(taskId);
        if (!task) this.ctx.throw(400, `没有该期刊[${taskId}]`);
        const userTask = {
          userId,
          taskId,
          name: task.name,
          type: task.type,
          url: task.url,
          lastReadTime: new Date()
        };
        await this.service.userTask.createUserTask(userTask);
        this.ctx.body = '订阅成功';
      } catch (err) {
        this.ctx.throw(err.status || 500, `订阅失败，请稍后重试... ${err.message}`);
      }
    }


    /**
     * 取消期刊订阅
     * @returns {Promise<void>}
     */
    //DELETE /api/v1/users/:uid/tasks/:taskId
    async cancelFollow() {
      try {
        const userId = +this.ctx.params.userId;
        const taskId = +this.ctx.params.taskId;

        await this.service.userTask.cancleFollowTask(userId, taskId);
        this.ctx.body = '已取消订阅';
      } catch (err) {
        this.ctx.throw(err.status || 500, `取消期刊订阅失败，请稍后重试... ${err.message}`);
      }
    }


  }

  return UserTaskController;
};
