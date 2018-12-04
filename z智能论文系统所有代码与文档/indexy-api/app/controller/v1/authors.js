'use strict';

// Restful Api 加载形式，详见：
// https://eggjs.org/zh-cn/basics/router.html

const lodash = require('lodash');

module.exports = app => {

  const {like} = app.Sequelize.Op;

  class AuthorController extends app.Controller {

    /**
     * 分页获取作者列表（根据粉丝数、文章数排序）
     * @param page
     * @param size
     * @param orders
     * @returns {Promise<void>}
     */
    // GET: /api/v1/user/:userId/authors
    async findPageAuthors({page = 0, size = 10, orders = ['id,desc']}) {
      this.logger.info(`分页获取作者列表 :${JSON.stringify(this.ctx.query)}`);

      // step1: 查出所有的author
      const userId = this.ctx.params.userId;
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
          realname: {[like]: `%${query.search}%`},
        };
      }

      this.ctx.logger.debug(condition);
      try {
        if (!userId) {
          this.ctx.body = await this.service.author.findAuthors(condition);
        } else {
          this.ctx.body = await this.service.author.findAuthorsWithFollow(userId, query.search, condition);
        }
      } catch (err) {
        this.ctx.throw(500, `获取数据失败，请稍后再试...${err.message}`);
      }
    }

    /**
     * 分页获取用户的作者定制列表:用户关注的作者
     * @returns {Promise<void>}
     */
    //GET /api/v1/user/:userId/userAuthors
    async findUserAuthorByPage({page = 0, size = 10, orders = ['id,desc']}) {
      this.logger.info(`分页获取用户的作者定制列表 :${JSON.stringify(this.ctx.query)}`);

      try {

        const userId = this.ctx.params.userId;
        // step1:用户关注的作者
        const userAuthors = await this.service.userAuthor.findUserAuthorsByUserId(userId);

        const authors = lodash.map(userAuthors, userAuthor => {
          return userAuthor.authorName;
        });

        if (authors && authors.length !== 0) {
          const query = this.ctx.query;
          if (query.page) page = +query.page;
          if (query.size) size = +query.size;

          //以作者为中心
          const pageAuthors = await this.service.author.findPageByAuthorNames(authors, page, size);
          for (let i = 0; i < pageAuthors.rows.length; i++) {
            const aut = pageAuthors.rows[i];
            let latestArticle = await this.service.article.findLatestArticleByAuthor(userId, aut.realname);
            aut.setDataValue('latestArticle', {
              id: latestArticle.id,
              title: latestArticle.title,
              publishTime: latestArticle.publishTime
            });
          }
          this.ctx.body = pageAuthors;
        } else {
          this.ctx.body = {
            rows: [],
            count: 0,
          };
        }
      } catch (err) {
        console.trace(err);
        this.ctx.throw(500, `获取用户关注的作者最新发布的文章列表失败，请稍后重试... ${err.message}`);
      }
    }

    /**
     * 获取作者详情
     * @returns {Promise<void>}
     */
    //GET /api/v1/users/:userId/authors/:id
    async findAuthorById() {
      this.logger.info(`查看作者详情:${JSON.stringify(this.ctx.params)}`);

      const userId = +this.ctx.params.userId;
      const authorId = +this.ctx.params.id;
      this.ctx.body = await this.service.author.findAuthorById(authorId);

      const isFollow = await this.service.userAuthor.hasFollowAuthor(userId, authorId);
      this.ctx.body.setDataValue('isFollow', isFollow);
    }

    /**
     * 根据作者名称获取作者id
     * @returns {Promise<void>}
     */
    //GET /api/v1/users/:userId/authors/:name/id
    async findAuthorIdByName(){
      this.logger.info(`根据作者名称获取作者id:${JSON.stringify(this.ctx.params)}`);

      const authorName = this.ctx.params.name;
      this.ctx.body=await this.service.author.findAuthorIdByName(authorName);
    }

    /**
     * 分页获取作者的文章列表
     * @returns {Promise<void>}
     */
    //GET api/v1/users/:userId/authors/:id/articles
    async findAuthorArticlesPage({page = 0, size = 10}) {
      const userId = +this.ctx.params.userId;
      const authorId = +this.ctx.params.id;

      const author = await this.service.author.findAuthorById(authorId);

      this.ctx.body = await this.service.article.findArticlesOfAuthorNames(userId, [author.realname], {
        offset: page * size,
        limit: size,
      });
    }

    /**
     用户关注作者
     */
    // POST  /api/v1/users/:userId/authors/:authorId
    async followAuthor() {
      this.logger.info(`用户关注作者:${JSON.stringify(this.ctx.params)}`);

      const userId = this.ctx.params.userId;
      const authorId = this.ctx.params.authorId;

      const author = await this.service.author.findAuthorById(authorId);
      if (!author) this.ctx.throw(400, `没有该作者[authorId:${authorId}]`);
      try {
        const uA = await this.service.userAuthor.findByUserIdAndAuthorId(userId, authorId);
        if (uA && uA.length !== 0) this.ctx.throw(400, '用户已经关注了该作者');

        const userAuthor = {
          userId,
          authorId,
          authorName: author.realname,
        };
        this.ctx.body = await this.service.userAuthor.createUserAuthor(userAuthor);
        // 更新author粉丝量
        const count = await this.service.userAuthor.findFollowCountOfAuthor(authorId);
        await this.service.author.updateAuthorById(authorId, {fans: count});
      } catch (err) {
        this.ctx.throw(err.status || 500, `关注作者失败，请稍后重试... ${err.message}`);
      }
    }

    /**
     * 用户取消关注作者
     * @returns {Promise<void>}
     */
    // DELETE  /api/v1/users/:userId/authors/:authorId
    async cancelFollowAuthor() {
      this.logger.info(`用户取消关注作者:${JSON.stringify(this.ctx.params)}`);

      const userId = this.ctx.params.userId;
      const authorId = this.ctx.params.authorId;

      try {
        this.ctx.body = await this.service.userAuthor.deleteUserAuthor(userId, authorId);
      } catch (err) {
        this.ctx.throw(500, `取消关注作者失败，请稍后重试... ${err.message}`);
      }
    }

    // 获取用户关注的所有作者最新的文章
    // GET  /api/v1/users/:userId/authors/articles
    // async getAuthorLatestArticle({page = 0, size = 10 /* orders = [ 'publishTime,desc' ]*/}) {
    //   this.logger.info(`分页获取用户关注的所有作者最新的文章 :${this.ctx.query}`);
    //
    //   try {
    //
    //     const userId = this.ctx.params.userId;
    //     // step1:用户关注的作者
    //     const userAuthors = await this.service.userAuthor.findUserAuthorsByUserId(userId);
    //
    //     const authors = lodash.map(userAuthors, userAuthor => {
    //       return userAuthor.authorName;
    //     });
    //
    //     if (authors && authors.length !== 0) {
    //       const query = this.ctx.query;
    //       if (query.page) page = +query.page;
    //       if (query.size) size = +query.size;
    //       // if (this.ctx.queries.order) orders = this.ctx.queries.orders;
    //
    //       const pageCondition = {
    //         offset: page * size,
    //         limit: size,
    //       };
    //
    //       this.ctx.body = await this.service.article.findArticlesOfAuthorNames(authors, pageCondition);
    //     } else {
    //       this.ctx.body = {
    //         rows: [],
    //         count: 0,
    //       };
    //     }

    // TODO 以后提倡的查询方式
    // step2:根据作者查询文章 按文章发布时间排序
    // const authorIds = lodash.map(userAuthors, userAuthor => {
    //   return userAuthor.authorId;
    // });
    //
    // const query = this.ctx.query;
    // if (query.page) page = +query.page;
    // if (query.size) size = +query.size;
    // if (this.ctx.queries.order) orders = this.ctx.queries.orders;
    //
    // const ords = orders.map(item => {
    //   return item.trim().split(',');
    // });
    //
    // const condition = {
    //   offset: page * size,
    //   limit: size,
    //   order: ords,
    //   where: {
    //     authorId: { [ opIn ]: authorIds },
    //   },
    // };
    //
    // this.ctx.body = await this.service.authorArticle.findAuthorArticles(condition);
    //   } catch (err) {
    //     console.trace(err);
    //     this.ctx.throw(500, `获取用户关注的作者最新发布的文章列表失败，请稍后重试... ${err.message}`);
    //   }
    //
    // }


  }

  return AuthorController;
};
