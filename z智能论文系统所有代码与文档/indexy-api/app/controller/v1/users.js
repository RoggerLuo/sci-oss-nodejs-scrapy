'use strict';

// Restful Api 加载形式，详见：
// https://eggjs.org/zh-cn/basics/router.html

module.exports = app => {

  class UserController extends app.Controller {

    // GET: /api/v1/users
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
        attributes: [ 'id', 'username', 'photo', 'nickName', 'job', 'school', 'mobile', 'email', 'introduct', 'created_at', 'updated_at' ],
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


    // PUT: /api/v1/users/:id
    async update() {
      const user_id = this.ctx.params.id;
      const body = this.ctx.request.body;

      // 用户名不能更改
      if (body.username) delete (body.username);

      // TODO 密码为空则不更新,不为空则加密更新
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

    // 用户注册[ POST /api/v1/users/register]
    async register() {
      this.logger.info(`用户注册,body:${this.ctx.request.body}`);

      const body = this.ctx.request.body;
      if (!body.username || !body.password) this.ctx.throw(400, '手机号或密码不能为空');

      const cond = {
        where: {
          username: body.username,
        },
      };
      const users = await this.service.user.findList(cond);

      if (users.length > 0) this.ctx.throw(400, '手机号已存在');

      // 对密码进行加密
      body.password = this.ctx.helper.md5WithSale(body.password);
      body.nickname = body.username;// 默认赋值
      body.mobile = body.username;// 目前是手机号注册

      try {
        await this.service.user.createUser(body);
        this.ctx.body = 1;// 注册成功
      } catch (err) {
        if (err.message.indexOf('Validation error') >= 0) {
          this.ctx.throw(400, `用户信息异常... ${err.message}`);
        }
        this.ctx.throw(500, `用户注册异常，请稍后重试... ${err.message}`);
      }
    }

    // 用户登录[ POST /api/v1/users/login]
    async login() {
      this.logger.info(`用户登录,body:${this.ctx.request.body}`);

      const body = this.ctx.request.body;
      if (!body.username || !body.password) this.ctx.throw(400, '手机号或密码不能为空');

      try {
      // 根据用户名查询
        const cond = {
          where: {
            username: body.username,
          },
        };
        const users = await this.service.user.findList(cond);
        if (users.length === 0) this.ctx.throw(400, '用户不存在');

        const success = this.ctx.helper.verifyMd5(body.password, users[0].password);
        if (!success) this.ctx.throw(400, '密码不正确');

        // 随机生成字符串作为token TODO 后期对接kong生成token
        const token = Math.random().toString(36).substr(2);
        await this.service.user.updateUserById(users[0].id, { token });
        this.ctx.body = {
          token,
          user_id: users[0].id,
        };
      } catch (err) {
        if (err.status === 400) {
          this.ctx.throw(400, `${err.message}`);
        }
        this.ctx.throw(err.status || 500, `删除用户异常，请稍后重试... ${err.message}`);
      }
    }


    // GET /api/v1/users/:userId/follow/tasks/articles
    // 获取用户订阅的期刊的文章：首页-》期刊
    // async getFollowArticles({ page = 0, size = 10, orders = [ 'publishTime,desc' ] }) {
    //   try {
    //     const userId = this.ctx.params.userId;
    //     const query = this.ctx.query;
    //     if (query.page) page = +query.page;
    //     if (query.size) size = +query.size;
    //
    //     if (this.ctx.queries.order) orders = this.ctx.queries.orders;
    //
    //     const ords = orders.map(item => {
    //       return item.trim().split(',');
    //     });
    //
    //     let condition = {
    //       where: {
    //         user_id: userId,
    //       },
    //       attributes: [ 'name' ],
    //     };
    //     const result = await this.service.userTask.findTasksByUserId(condition);
    //     const journals = [];
    //     result.forEach(val => {
    //       journals.push(val.name);
    //     });
    //     // 根据期刊名关联文章
    //     condition = {
    //       where: {
    //         journal: {
    //           in: journals,
    //         },
    //       },
    //       offset: page * size,
    //       limit: size,
    //       order: ords,
    //     };
    //     this.ctx.body = await this.service.article.findArticles(condition);
    //   } catch (err) {
    //     this.ctx.throw(500, `获取用户订阅的期刊的文章列表失败，请稍后重试... ${err.message}`);
    //   }
    // }
  }

  return UserController;
};
