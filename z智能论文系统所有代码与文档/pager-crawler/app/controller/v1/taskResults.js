'use strict';

// Restful Api 加载形式，详见：
// https://eggjs.org/zh-cn/basics/router.html

module.exports = app => {

  const { or, like } = app.Sequelize.Op;

  class TaskResultController extends app.Controller {

    // GET: /api/v1/taskResults
    async index({ page = 0, size = 10, orders = [ 'id,desc' ] }) {

      const query = this.ctx.query;
      if (query.page) page = +query.page;
      if (query.size) size = +query.size;
      if (this.ctx.queries.order) orders = this.ctx.queries.order; // ["id,desc", "name,asc"]

      const ords = orders.map(item => {
        return item.trim().split(',');
      }); // e.g. [[ "id", "desc" ], ["name", "asc"]]
      this.logger.debug(ords);

      const condition = {
        offset: page * size,
        limit: size,
        order: ords,
        include: { // 返回内容包含外键对象
          model: this.ctx.model.Task,
          as: 'task',
        },
        attributes: [ 'id', 'task_id', 'state', 'description', 'created_at', 'updated_at', 'progress' ],
      };
      // 外键对象模糊查询 where: {}
      if (query.search) {
        condition.include.where = { // 模糊查询
          [ or ]: [{
            name: {
              [ like ]: `%${query.search}%`,
            },
          },
          {
            type: {
              [ like ]: `%${query.search}%`,
            },
          },
          {
            url: {
              [ like ]: `%${query.search}%`,
            },
          },
          ],
        };
      }

      // state查询
      if (query.state) {
        condition.where = {
          state: query.state,
        };
      }

      try {
        // service await 后 controller 也需要 await 接收结果
        this.ctx.body = await this.service.taskResult.findTaskResults(condition);
      } catch (err) {
        this.ctx.throw(500, `分页询任务结果异常，请稍后重试... ${err.message}`);
      }
    }


    // GET: /api/v1/taskResults/:id
    async show() {
      const task_id = this.ctx.params.id;
      try {
        this.ctx.body = await this.service.taskResult.findTaskResultById(task_id);
      } catch (err) {
        this.ctx.throw(500, `任务结果查询异常，请稍后重试... ${err.message}`, {
          extra_info: task_id,
        });
      }
    }


    // POST: /api/v1/taskResults
    async create() {
      const taskId = this.ctx.query.taskId;

      try {
        const created = await this.service.taskResult.createTaskResult(taskId);
        this.ctx.status = 201;
        this.ctx.body = created;

        // 发布 task 信号
        app.nc.publish(app.config.nats.subject, String(created.id), (err, guid) => {
          this.logger.debug(`消息发布 Ack: ${guid || err}`);
          console.log(`消息发布 Ack: ${guid || err}`);
        });

      } catch (err) {
        this.ctx.throw(500, `新增任务结果异常，请稍后重试... ${err.message}`, {
          extra_info: taskId,
        });
      }
    }


    // PUT: /api/v1/taskResults/:id
    async update() {
      const task_id = this.ctx.params.id;
      // let user_id = +ctx.params.user_id; // 用户只能更新自己的
      const body = this.ctx.request.body;

      try {
        const updated = await this.service.taskResult.updateTaskResultById(task_id, body);
        this.ctx.body = updated;
      } catch (err) {
        this.ctx.throw(500, `更新任务结果异常，请稍后重试... ${err.message}`, {
          extra_info: body,
        });
      }
    }


    // DELETE: /api/v1/taskResults/:id1,:id2,:id3...
    async destroy() {
      let task_ids = this.ctx.params.id; // `GET /api/users/1,2,3` => `['1', '2', '3']`
      try {
        task_ids = task_ids.split(',');
        this.ctx.body = await this.service.taskResult.deleteTaskResultByIds(task_ids);
        this.ctx.status = 200;
      } catch (err) {
        this.ctx.throw(500, `删除任务结果异常，请稍后重试...:${err.message}`, {
          extra_info: task_ids,
        });
      }
    }

  }

  return TaskResultController;
};
