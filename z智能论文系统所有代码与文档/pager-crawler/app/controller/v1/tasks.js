'use strict';

// Restful Api 加载形式，详见：
// https://eggjs.org/zh-cn/basics/router.html

module.exports = app => {

  const {or, like} = app.Sequelize.Op;

  const timer_subject = 'task.timer';

  class TaskController extends app.Controller {

    // GET: /api/v1/tasks
    async index({page = 0, size = 10, orders = ['id,desc']}) {

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
        attributes: ['id', 'name', 'type', 'options', 'fields', 'url', 'remark', 'created_at', 'updated_at'],
        order: ords,
      };
      // where: {}
      if (query.search) { // ?search=xxxx => name|type|url
        condition.where = { // 模糊查询
          [or]: [{
            name: {
              [like]: `%${query.search}%`,
            },
          },
            {
              type: {
                [like]: `%${query.search}%`,
              },
            },
            {
              url: {
                [like]: `%${query.search}%`,
              },
            },
          ],
          // [ and ]: []
        };
      }

      try {
        // service await 后 controller 也需要 await 接收结果
        this.ctx.body = await this.service.task.findTasks(condition);
      } catch (err) {
        this.ctx.throw(500, `分页询任务异常，请稍后重试... ${err.message}`);
      }
    }

    // 获取期刊名称列表
    // GET /api/v1/tasks/names
    async getTaskNames() {
      this.logger.info(`获取期刊名称 :${this.ctx.query}`);

      try {
        const condition = {
          attributes: ['id', 'name'],
        };
        this.ctx.body = await this.service.task.findTasks(condition);
      } catch (err) {
        this.ctx.throw(500, `获取期刊名称异常，请稍后重试... ${err.message}`);
      }
    }

    // GET: /api/v1/tasks/:id
    async show() {
      const task_id = this.ctx.params.id;
      try {
        this.ctx.body = await this.service.task.findTaskById(task_id);
      } catch (err) {
        this.ctx.throw(500, `任务查询异常，请稍后重试... ${err.message}`, {
          extra_info: task_id,
        });
      }
    }


    // POST: /api/v1/tasks
    async create() {
      const body = this.ctx.request.body;

      try {
        const created = await this.service.task.createTask(body);
        this.ctx.status = 201;
        this.ctx.body = created;
      } catch (err) {
        this.ctx.throw(500, `新增任务异常，请稍后重试... ${err.message}`, {
          extra_info: body,
        });
      }
    }


    // PUT: /api/v1/tasks/:id
    async update() {
      const task_id = this.ctx.params.id;
      // let user_id = +ctx.params.user_id; // 用户只能更新自己的
      const body = this.ctx.request.body;
      try {
        const updated = await this.service.task.updateTaskById(task_id, body);
        this.ctx.body = updated;
      } catch (err) {
        this.ctx.throw(500, `更新任务异常，请稍后重试... ${err.message}`, {
          extra_info: body,
        });
      }
    }


    /**
     * 删除任务
     * @returns {Promise<void>}
     */
    // DELETE: /api/v1/tasks/:id
    async destroy() {
      let task_id = this.ctx.params.id;
      try {

        //删除任务[期刊]，会触发一系列删除操作
        //删除用户收藏文章数据、用户屏蔽文章数据、文章、任务结果、用户关注的期刊数据
        const task = await  this.service.task.findTaskById(task_id);
        if (!!task) {
          const articleIds = await this.service.article.findArticleIdsByJournal(task.name);
          if (articleIds && articleIds.length > 0) {
            await this.service.userCollection.deleteByArticleIds(articleIds);
            await this.service.userDisincline.deleteByArticleIds(articleIds);
          }
          await this.service.article.deleteArticleByJournal(task.name);
          await this.service.taskResult.deleteByTaskIds([task_id]);
          await this.service.userTask.deleteByTaskIds([task_id]);

          this.ctx.body = await this.service.task.deleteTaskByIds([task_id]);
        } else {
          this.ctx.body = `不存在该任务:${task_id}`;
        }
      } catch (err) {
        if (err.message.includes('foreign key constraint')) {
          this.ctx.throw(400, `删除任务异常，需要先删除任务结果...:${err.message}`, {
            extra_info: task_id,
          });
        } else {
          this.ctx.throw(500, `删除任务异常，请稍后重试...:${err.message}`, {
            extra_info: task_id,
          });
        }

      }
    }


    // 预览结果
    async previewResult() {
      const body = this.ctx.request.body;
      const fields = JSON.parse(body.fields);
      if (fields.length === 0) {
        this.ctx.throw(400, 'fields参数异常...', {
          extra_info: fields,
        });
      }
      fields[0].target = body.url;
      try {
        this.ctx.body = await this.ctx.service.task.previewResult(fields);
      } catch (err) {
        console.log(fields)
        this.ctx.throw(500, err.message, {
          extra_info: fields,
        });
      }
    }


    // 设置定时任务
    async setSchedule() {
      const task_id = this.ctx.params.id;
      const body = this.ctx.request.body; // { schedule: true, cron: '5/* * * * * *' }

      try {
        const task = await this.service.task.findTaskById(task_id);

        let options = JSON.parse(task.options);
        options.task_opts.schedule = body.schedule;
        options.task_opts.cron = body.cron || options.task_opts.cron;
        options = JSON.stringify(options);

        const updated = await this.service.task.updateTaskById(task_id, {options});
        this.ctx.body = updated;

        // 发布 操作定时任务 信号
        app.nc.publish(timer_subject, String(task.id), (err, guid) => {
          this.logger.info(`消息发布 Ack: ${guid || err}`);
        });

      } catch (err) {
        this.ctx.throw(500, `设置定时任务异常，请稍后重试... ${err.message}`, {
          extra_info: body,
        });
      }
    }

  }

  return TaskController;
};
