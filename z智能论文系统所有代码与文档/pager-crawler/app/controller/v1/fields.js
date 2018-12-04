'use strict';

// Restful Api 加载形式，详见：
// https://eggjs.org/zh-cn/basics/router.html


module.exports = app => {
  // const { in: opIn } = app.Sequelize.Op;

  class FieldController extends app.Controller {

    // GET: /api/v1/fields
    async index({ page = 0, size = 10, orders = [ 'id,desc' ] }) {
      this.logger.info(`分页查询领域:${JSON.stringify(this.ctx.query)}`);

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
      };

      try {
        this.ctx.body = await this.service.field.findFields(condition);
      } catch (err) {
        this.logger.error(JSON.stringify(err));

        this.ctx.throw(500, `分页查询领域异常，请稍后重试... ${err.message}`);
      }

    }

    // GET /api/v1/fields/firstLevel
    async getFirstLevelFields() {
      this.logger.info(`获取一级领域:${JSON.stringify(this.ctx.query)}`);

      try {
        const condition = {
          where: { parentId: null },
        };
        this.ctx.body = await this.service.field.findList(condition);
      } catch (err) {
        this.logger.error(JSON.stringify(err));

        this.ctx.throw(500, `分页查询领域异常，请稍后重试... ${err.message}`);
      }
    }
    // GET /api/v1/fields/:id/childrens
    async getChildrensByParentId() {
      this.logger.info(`根据父级领域获取直属子级领域:${JSON.stringify(this.ctx.query)}`);

      const field_id = +this.ctx.params.id;
      try {
        const condition = {
          where: { parentId: field_id },
        };
        this.ctx.body = await this.service.field.findList(condition);
      } catch (err) {
        this.logger.error(JSON.stringify(err));

        this.ctx.throw(500, `查询领域异常，请稍后重试... ${err.message}`);
      }
    }

    // GET /api/v1/fields/:id/childrenTree
    async getChildrenTreeByParentId() {
      this.logger.info(`根据父级领域获取树形的子级领域:${JSON.stringify(this.ctx.query)}`);

      const field_id = +this.ctx.params.id;
      try {
        const allFields = await this.service.field.findList({});

        this.ctx.body = await this.service.field.buildFieldTree(allFields, field_id);
      } catch (err) {
        this.logger.error(JSON.stringify(err));

        this.ctx.throw(500, `根据父级领域获取树形的子级领域异常，请稍后重试... ${err.message}`);
      }
    }


    // GET: /api/v1/fields/:id
    async show() {
      this.logger.info(`查看领域详情:${JSON.stringify(this.ctx.params)}`);

      const field_id = +this.ctx.params.id;
      this.ctx.body = await this.service.field.findFieldById(field_id);
    }


    // POST: /api/v1/fields
    async create() {
      this.logger.info(`新增领域:${JSON.stringify(this.ctx.request.body)}`);

      const body = this.ctx.request.body;
      try {
        const field = await this.service.field.createField(body);
        this.ctx.body = field;
      } catch (err) {
        this.logger.error(JSON.stringify(err));
        if (err.message.indexOf('Validation error') >= 0) {
          this.ctx.throw(400, `领域信息异常... ${err.message}`);
        }
        this.ctx.throw(500, `新增领域异常，请稍后重试... ${err.message}`);
      }

    }


    // PUT: /api/v1/fields/:id
    async update() {
      this.logger.info(`修改领域:${this.ctx.params.id},${JSON.stringify(this.ctx.request.body)}`);

      const field_id = this.ctx.params.id;
      const body = this.ctx.request.body;
      try {
        this.ctx.body = await this.service.field.updateFieldById(field_id, body);
      } catch (err) {
        this.logger.error(JSON.stringify(err));

        if (err.message.indexOf('Validation error') >= 0) {
          this.ctx.throw(400, `领域信息异常... ${err.message}`);
        }
        this.ctx.throw(500, `修改领域信息异常，请稍后重试... ${err.message}`);
      }

    }

    // DELETE: /api/v1/fields/:id1,:id2,:id3...
    async destroy() {
      this.logger.info(`删除领域:${this.ctx.params.id}`);

      let field_ids = this.ctx.params.id; // `GET /api/fields/1,2,3` => `['1', '2', '3']`
      field_ids = field_ids.split(',');
      try {
        // 删除关联的用户领域
        await this.service.userField.deleteByFieldIds(field_ids);
        this.ctx.body = await this.service.field.deleteFieldByIds(field_ids);
      } catch (err) {
        this.ctx.throw(500, `删除领域异常，请稍后重试... ${err.message}`);
      }
    }
  }

  return FieldController;
};
