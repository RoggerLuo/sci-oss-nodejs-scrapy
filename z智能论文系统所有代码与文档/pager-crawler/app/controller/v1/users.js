'use strict';

// Restful Api 加载形式，详见：
// https://eggjs.org/zh-cn/basics/router.html

module.exports = app => {

  class UserController extends app.Controller {

    // GET: /api/v1/users
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
        attributes: ['id', 'username', 'photo', 'nickName', 'job', 'school', 'mobile', 'email', 'introduct', 'created_at', 'updated_at'],
        order: ords,
      };

      try {
        this.ctx.body = await this.service.user.findUsers(condition);
      } catch (err) {
        this.ctx.throw(500, `分页查询用户异常，请稍后重试... ${err.message}`);
      }

    }


    // GET: /api/v1/users/:id
    async show() {
      const user_id = this.ctx.params.id;
      this.ctx.body = await this.service.user.findUserById(user_id);
    }


    // POST: /api/v1/users
    async create() {
      const body = this.ctx.request.body;

      // 对密码进行加密
      body.password = this.ctx.helper.md5WithSale(body.password);
      try {
        const user = await this.service.user.createUser(body);
        user.password = null;
        this.ctx.body = user;
      } catch (err) {
        if (err.message.indexOf('Validation error') >= 0) {
          this.ctx.throw(400, `用户信息异常... ${err.message}`);
        }
        this.ctx.throw(500, `新增用户异常，请稍后重试... ${err.message}`);
      }

    }


    // PUT: /api/v1/users/:id
    async update() {
      const user_id = this.ctx.params.id;
      const body = this.ctx.request.body;

      // 用户名不能更改
      if (body.username) delete (body.username);

      // 密码为空则不更新,不为空则加密更新
      if (body.password) {
        body.password = this.ctx.helper.md5WithSale(body.password);
      } else {
        delete (body.password);
      }

      try {
        this.ctx.body = await this.service.user.updateUserById(user_id, body);
      } catch (err) {
        if (err.message.indexOf('Validation error') >= 0) {
          this.ctx.throw(400, `用户信息异常... ${err.message}`);
        }
        this.ctx.throw(500, `修改用户信息异常，请稍后重试... ${err.message}`);
      }

    }

    // DELETE: /api/v1/users/:id1,:id2,:id3...
    async destroy() {
      let user_ids = this.ctx.params.id; // `GET /api/users/1,2,3` => `['1', '2', '3']`
      user_ids = user_ids.split(',');

      try {
        //删除用户关注的期刊、领域、作者、用户收藏、用户屏蔽的文章
        await this.service.userTask.deleteByUserIds(user_ids);
        await this.service.userField.deleteByUserIds(user_ids);
        await this.service.userAuthor.deleteByUserIds(user_ids);
        await this.service.userCollection.deleteByUserIds(user_ids);
        await this.service.userDisincline.deleteByUserIds(user_ids);
        this.ctx.body = await this.service.user.deleteUserByIds(user_ids);
      } catch (err) {
        this.ctx.throw(500, `删除用户异常，请稍后重试... ${err.message}`);
      }
    }
  }

  return UserController;
};
