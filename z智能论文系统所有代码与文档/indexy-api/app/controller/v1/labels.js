'use strict';

// Restful Api 加载形式，详见：
// https://eggjs.org/zh-cn/basics/router.html
/**
 * 收藏标签管理相关api
 */

const lodash = require('lodash');


module.exports = app => {
  // const { in: opIn } = app.Sequelize.Op;

  class LabelController extends app.Controller {

    // GET: /api/v1/labels
    // async index({ page = 0, size = 10, orders = [ 'id,desc' ] }) {
    //   this.logger.info(`分页查询收藏标签:${JSON.stringify(this.ctx.query)}`);
    //
    //   const query = this.ctx.query;
    //   if (query.page) page = +query.page;
    //   if (query.size) size = +query.size;
    //   if (this.ctx.queries.order) orders = this.ctx.queries.order; // ["id,desc", "name,asc"]
    //
    //   const ords = orders.map(item => {
    //     return item.trim().split(',');
    //   }); // e.g. [[ "id", "desc" ], ["name", "asc"]]
    //   this.logger.debug(ords);
    //
    //   const condition = {
    //     offset: page * size,
    //     limit: size,
    //     order: ords,
    //   };
    //
    //   try {
    //     this.ctx.body = await this.service.label.findLabels(condition);
    //   } catch (err) {
    //     this.logger.error(JSON.stringify(err));
    //
    //     this.ctx.throw(500, `分页查询收藏标签异常，请稍后重试... ${err.message}`);
    //   }
    //
    // }

    /**
     * 获取用户所有收藏标签
     * @param page
     * @param size
     * @param orders
     * @returns {Promise<void>}
     */
    //GET /api/v1/users/:userId/labels
    async index() {
      this.logger.info(`分页查询收藏标签:${JSON.stringify(this.ctx.query)}`);

      const userId = +this.ctx.params.userId;

      try {
        this.ctx.body = await this.service.label.findListByUserId(userId);
      } catch (err) {
        this.logger.error(JSON.stringify(err));
        this.ctx.throw(500, `查询收藏标签异常，请稍后重试... ${err.message}`);
      }
    }

    // GET: /api/v1/users/:userId/labels/:id
    async show() {
      this.logger.info(`查看收藏标签详情:${JSON.stringify(this.ctx.params)}`);

      const labelId = +this.ctx.params.id;
      this.ctx.body = await this.service.label.findLabelById(labelId);
    }


    // POST: /api/v1/users/:userId/labels
    async create() {
      this.logger.info(`新增收藏标签:${JSON.stringify(this.ctx.request.body)}`);

      const userId = +this.ctx.params.userId;
      const body = this.ctx.request.body;
      try {
        body.userId = userId;
        const label = await this.service.label.createLabel(body);
        this.ctx.body = label;
      } catch (err) {
        this.logger.error(JSON.stringify(err));
        if (err.message.indexOf('Validation error') >= 0) {
          this.ctx.throw(400, `收藏标签信息异常... ${err.message}`);
        }
        this.ctx.throw(500, `新增收藏标签异常，请稍后重试... ${err.message}`);
      }

    }


    // PUT: /api/v1/users/:userId/labels/:id
    async update() {
      this.logger.info(`修改收藏标签:${this.ctx.params.id},${JSON.stringify(this.ctx.request.body)}`);

      const userId = +this.ctx.params.userId;
      const labelId = this.ctx.params.id;
      const body = this.ctx.request.body;

      const label = await this.service.label.findLabelById(labelId);
      if (!label || label.userId != userId) this.ctx.throw(400, `收藏标签不存在或不属于当前用户,不允许修改`);
      try {
        this.ctx.body = await this.service.label.updateLabelById(labelId, {name: body.name});
      } catch (err) {
        this.logger.error(JSON.stringify(err));

        if (err.message.indexOf('Validation error') >= 0) {
          this.ctx.throw(400, `收藏标签信息异常... ${err.message}`);
        }
        this.ctx.throw(500, `修改收藏标签信息异常，请稍后重试... ${err.message}`);
      }

    }

    // DELETE: /api/v1/labels/:id1,:id2,:id3...
    async destroy() {
      this.logger.info(`删除收藏标签:${this.ctx.params.id}`);

      let labelIds = this.ctx.params.id; // `GET /api/labels/1,2,3` => `['1', '2', '3']`
      labelIds = labelIds.split(',');
      try {
        this.ctx.body = await this.service.label.deleteLabelByIds(labelIds);
      } catch (err) {
        this.ctx.throw(500, `删除收藏标签异常，请稍后重试... ${err.message}`);
      }
    }

  }

  return LabelController;
};
