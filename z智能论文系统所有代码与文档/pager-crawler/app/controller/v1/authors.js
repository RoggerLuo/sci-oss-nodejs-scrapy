'use strict';

// Restful Api 加载形式，详见：
// https://eggjs.org/zh-cn/basics/router.html


module.exports = app => {

  const { like } = app.Sequelize.Op;

  class AuthorController extends app.Controller {

    // GET: /api/v1/authors?userId=1
    // 分页获取作者列表（根据粉丝数、文章数排序）
    async index({ page = 0, size = 10, orders = [ 'id,desc' ] }) {
      this.logger.info(`分页获取作者列表 :${JSON.stringify(this.ctx.query)}`);

      // step1: 查出所有的author
      const query = this.ctx.query;
      if (query.page) page = +query.page;
      if (query.size) size = +query.size;
      if (this.ctx.queries.order) orders = this.ctx.queries.order;

      const ords = orders.map(item => {
        return item.trim().split(',');
      });

      const condition = {
        offset: page * size,
        limit: size,
        order: ords,
      };
      if (query.search) {
        condition.where = {
          realname: { [like]: `%${query.search}%` },
        };
      }

      this.ctx.logger.debug(condition);
      try {
        this.ctx.body = await this.service.author.findAuthors(condition);
      } catch (err) {
        this.ctx.throw(500, `获取数据失败，请稍后再试...${err.message}`);
      }
    }

    // POST: /api/v1/authors
    async create() {
      this.logger.info(`新增作者:${JSON.stringify(this.ctx.request.body)}`);

      const body = this.ctx.request.body;
      try {
        const author = await this.service.author.createAuthor(body);
        this.ctx.body = author;
      } catch (err) {
        this.logger.error(JSON.stringify(err));
        if (err.message.indexOf('Validation error') >= 0) {
          this.ctx.throw(400, `作者信息异常... ${err.message}`);
        }
        this.ctx.throw(500, `新增作者异常，请稍后重试... ${err.message}`);
      }

    }


    // PUT: /api/v1/authors/:id
    async update() {
      this.logger.info(`修改作者:${this.ctx.params.id},${JSON.stringify(this.ctx.request.body)}`);

      const author_id = this.ctx.params.id;
      const body = this.ctx.request.body;
      try {
        this.ctx.body = await this.service.author.updateAuthorById(author_id, body);
      } catch (err) {
        this.logger.error(JSON.stringify(err));

        if (err.message.indexOf('Validation error') >= 0) {
          this.ctx.throw(400, `作者信息异常... ${err.message}`);
        }
        this.ctx.throw(500, `修改作者信息异常，请稍后重试... ${err.message}`);
      }

    }

    // DELETE: /api/v1/authors/:id1,:id2,:id3...
    async destroy() {
      this.logger.info(`删除作者:${this.ctx.params.id}`);

      let author_ids = this.ctx.params.id; // `GET /api/authors/1,2,3` => `['1', '2', '3']`
      author_ids = author_ids.split(',');
      try {
        // 删除关联的用户关注作者记录
        await this.service.userAuthor.deleteByAuthorIds(author_ids);
        this.ctx.body = await this.service.author.deleteAuthorByIds(author_ids);
      } catch (err) {
        this.ctx.throw(500, `删除作者异常，请稍后重试... ${err.message}`);
      }
    }

    // 把文章里的作者存入到作者表
    // async bulkCreate() {
    //   this.logger.info('读取articles数据表的作者信息批量插入到作者数据表中');
    //
    //   try {
    //     const articles = (await this.service.article.findArticles({ where: { id: { $lte: 10000, $gt: 5000 } } })).rows;
    //     let authors = [];
    //     const globalAuthorNames = [];
    //     for (let j = 0; j < articles.length; j++) {
    //       const authorNames = articles[j].author.split(',');
    //       for (let i = 0; i < authorNames.length; i++) {
    //         authorNames[i] = authorNames[i].trim();
    //         if (globalAuthorNames.indexOf(authorNames[i]) < 0) {
    //           globalAuthorNames.push(authorNames[i]);
    //           authors.push({ realname: authorNames[i], nickname: authorNames[i] });
    //           if (authors.length >= 1000) {
    //             const temp = authors;
    //             authors = [];
    //             await this.service.author.bulkCreateAuthors(temp);
    //           }
    //         }
    //       }
    //     }
    //     await this.service.author.bulkCreateAuthors(authors);
    //     this.ctx.body = 1;
    //   } catch (err) {
    //     console.trace(err);
    //     if (err.message.indexOf('Validation error') >= 0) {
    //       this.ctx.throw(400, `作者信息异常... ${err.message}`);
    //     }
    //     this.ctx.throw(500, `新增作者异常，请稍后重试... ${err.message}`);
    //   }
    // }

  }
  return AuthorController;
};
