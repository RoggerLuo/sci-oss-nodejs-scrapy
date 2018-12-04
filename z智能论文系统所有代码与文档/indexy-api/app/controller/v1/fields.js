'use strict';

// Restful Api 加载形式，详见：
// https://eggjs.org/zh-cn/basics/router.html

const lodash = require('lodash');


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
      this.logger.info(`根据父级领域获取子级领域:${JSON.stringify(this.ctx.query)}`);

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
        this.ctx.body = await this.service.field.deleteFieldByIds(field_ids);
      } catch (err) {
        this.ctx.throw(500, `删除领域异常，请稍后重试... ${err.message}`);
      }
    }

    // 用户是否已关注领域
    // GET  /api/v1/users/:userId/hasFollowField
    async hasFollowField() {
      try {
        this.logger.info(`查看用户是否关注了领域:${this.ctx.params.id}`);

        const userId = this.ctx.params.userId;
        const uA = await this.service.userField.findUserFieldsByUserId(userId);
        if (uA && uA.length === 0) { // 还没关注任何领域
          this.ctx.body = '0';// 使用true,false 框架会自动转换false值为""
        } else {
          this.ctx.body = '1';
        }
      } catch (err) {
        console.trace(err);
        this.ctx.throw(500, `查看用户是否关注了领域异常，请稍后重试... ${err.message}`);
      }
    }

    // 用户关注领域
    // POST  /api/v1/users/:userId/follow/fields/:fieldId
    async followField() {
      try {
        this.logger.info(`用户关注领域:${JSON.stringify(this.ctx.params)}`);

        const userId = this.ctx.params.userId;
        const fieldIds = this.ctx.params.fieldId.split(',');
        const uFs = await this.service.userField.findByUserIdAndFieldIds(userId, fieldIds);
        const uFIds = uFs && uFs.length !== 0 ? uFs.map(uF => { return uF.fieldId; }) : [];
        this.logger.info(`用户已关注/屏蔽的领域:${uFIds}`);

        const uFields = [];
        for (let i = 0; i < fieldIds.length; i++) {
          if (uFIds.indexOf(+fieldIds[i]) < 0) {
            const userField = {
              userId,
              fieldId: fieldIds[i],
              isFollow: true, // 感兴趣
            };
            uFields.push(userField);
          }
        }
        this.ctx.body = await this.service.userField.bulkCreateUserField(uFields);
      } catch (err) {
        console.trace(err);
        this.ctx.throw(err.status || 500, `关注领域失败，请稍后重试... ${err.message}`);
      }


      // const field = await this.service.field.findFieldById(fieldId);
      // if (!field) this.ctx.throw(400, `没有该领域[fieldId:${fieldId}]`);
      // try {
      //   const uA = await this.service.userField.findByUserIdAndFieldId(userId, fieldId);
      //   if (uA && uA.length !== 0 && uA[0].isFollow) this.ctx.throw(400, '用户已经关注了该领域');
      //   if (uA && uA.length !== 0 && uA[0].isFollow) this.ctx.throw(400, '用户已经屏蔽了该领域');
      //
      //   const userField = {
      //     userId,
      //     fieldId,
      //     isFollow: true, // 感兴趣
      //   };
      //   this.ctx.body = await this.service.userField.createUserField(userField);
      // } catch (err) {
      //   this.ctx.throw(err.status || 500, `关注领域失败，请稍后重试... ${err.message}`);
      // }
    }

    // 用户屏蔽领域
    // POST  /api/v1/users/:userId/unfollow/fields/:fieldId
    async unFollowField() {
      this.logger.info(`用户关注领域:${JSON.stringify(this.ctx.params)}`);

      const userId = this.ctx.params.userId;
      const fieldId = this.ctx.params.fieldId;

      const field = await this.service.field.findFieldById(fieldId);
      if (!field) this.ctx.throw(400, `没有该领域[fieldId:${fieldId}]`);

      const uA = await this.service.userField.findByUserIdAndFieldId(userId, fieldId);
      if (uA && uA.length !== 0 && uA[0].isFollow) this.ctx.throw(400, '用户已经关注了该领域');
      if (uA && uA.length !== 0 && !uA[0].isFollow) this.ctx.throw(400, '用户已经屏蔽了该领域');

      try {
        const userField = {
          userId,
          fieldId,
          isFollow: false, // 不感兴趣
        };
        this.ctx.body = await this.service.userField.createUserField(userField);
      } catch (err) {
        this.ctx.throw(500, `屏蔽领域失败，请稍后重试... ${err.message}`);
      }
    }

    // 获取用户关注的领域文章
    // 获取用户关注的所有领域最新的文章
    // GET  /api/v1/users/:userId/fields/articles
    async getFieldLatestArticle({ page = 0, size = 10 /* orders = [ 'publishTime,desc' ]*/ }) {
      this.logger.info(`分页获取用户关注的所有领域最新的文章 :${this.ctx.query}`);

      try {

        const userId = this.ctx.params.userId;
        // step1:用户关注的领域
        const userFields = await this.service.userField.findUserFieldsByUserId(userId);

        const fields = lodash.map(userFields, userField => {
          return userField.field.name;
        });

        if (fields && fields.length !== 0) {
          const query = this.ctx.query;
          if (query.page) page = +query.page;
          if (query.size) size = +query.size;
          // if (this.ctx.queries.order) orders = this.ctx.queries.orders;

          const pageCondition = {
            offset: page * size,
            limit: size,
          };

          this.ctx.body = await this.service.article.findArticlesOfFieldNames(fields, pageCondition);
        } else {
          this.ctx.body = {
            rows: [],
            count: 0,
          };
        }

        // TODO 后期推荐方式
        // step2:根据领域查询文章 按文章发布时间排序
        // const fieldIds = lodash.map(userFields, userField => {
        //   return userField.fieldId;
        // });
        //
        // const query = this.ctx.query;
        // if (query.page) page = +query.page;
        // if (query.size) size = +query.size;
        // if (this.ctx.queries.order) orders = this.ctx.queries.orders;

        // const ords = orders.map(item => {
        //   return item.trim().split(',');
        // });

        // const condition = {
        //   offset: page * size,
        //   limit: size,
        //   order: ords,
        //   include: { // 返回内容包含外键对象
        //     model: this.ctx.model.Article,
        //     as: 'article',
        //   },
        //   where: {
        //     fieldId: { [ opIn ]: fieldIds },
        //   },
        // };
        //
        // this.ctx.body = await this.service.fieldArticle.findFieldArticles(condition);
      } catch (err) {
        console.trace(err);
        this.ctx.throw(500, `获取用户关注的领域最新发布的文章列表失败，请稍后重试... ${err.message}`);
      }

    }

    // 获取用户已关注的领域列表
    // GET /api/v1/users/:userId/fields
    async getUserFields() {
      this.logger.info(`获取用户已关注的领域列表 :${this.ctx.params}`);

      try {
        const userId = this.ctx.params.userId;
        const userFields = await this.service.userField.findUserFieldsByUserId(userId);
        const fields = userFields.map(uf => {
          return { id: uf.field.id, userId: uf.userId, name: uf.field.name };
        });
        this.ctx.body = fields;
      } catch (err) {
        console.trace(err);
        this.ctx.throw(500, `获取用户已关注的领域列表失败，请稍后重试... ${err.message}`);
      }
    }
  }

  return FieldController;
};
