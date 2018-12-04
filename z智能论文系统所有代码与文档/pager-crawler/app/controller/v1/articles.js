'use strict';

// Restful Api 加载形式，详见：
// https://eggjs.org/zh-cn/basics/router.html

module.exports = app => {

  const {or, like, gte, lte} = app.Sequelize.Op;

  class ArticleController extends app.Controller {

    // GET: /api/v1/articles
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
        order: ords,
      };
      // where: {title:{[like]:xxx}}
      if (query.title) { // ?title=xxxx
        if (!condition.where) condition.where = {};
        condition.where.title = {
          [like]: `%${query.title}%`,
        };
      }
      // where: {journal:{[like]:xxx}}
      if (query.journal) { // ?title=xxxx
        if (!condition.where) condition.where = {};
        condition.where.journal = {
          [like]: `%${query.journal}%`,
        };
      }

      // where: {author:{[like]:xxx}}
      if (query.author) { // ?author=xxxx
        if (!condition.where) condition.where = {};
        condition.where.author = {
          [like]: `%${query.author}%`,
        };
      }
      // 法1：逗号分割,这样才能精确匹配，eg: 2,3,11 contains 1 => ,2,3,11, like %,1,% (如果直接like %1% 则11也可能匹配)
      // TODO 上面的法1目前还没实现,暂时模糊匹配,但特殊情况会有问题(如上面查询1时包含11的记录也会匹配成功)
      // where: {[or]:[{tags:{[like]:%tag1%}},{tags:{[like]:%tag2%}}}]}
      if (query.tags) { // ?tags=xxxx
        if (!condition.where) condition.where = {};

        const tags = query.tags.split(','); // tags=[tag1,tag2]
        const orCondition = [];
        tags.map(tag => {
          // let cond1 = {tags: {[like]: '%' + tag + ",%"}}
          // let cond2 = {tags: {[like]: '%,' + tag + "%"}}
          // let cond3 = {tags: {[like]: '%,' + tag + ",%"}}
          // orCondition.push(cond1, cond2, cond3)
          const cond = {
            tags: {
              [like]: '%' + tag + '%',
            },
          };
          return orCondition.push(cond);
        });
        condition.where[or] = orCondition;
      }
      this.ctx.logger.debug(condition);

      try {
        // service await 后 controller 也需要 await 接收结果
        this.ctx.body = await this.service.article.findArticles(condition);
      } catch (err) {
        this.ctx.throw(500, `分页询任务异常，请稍后重试... ${err.message}`);
      }
    }


    // GET: /api/v1/articles/:id
    async show() {
      const task_id = this.ctx.params.id;
      try {
        this.ctx.body = await this.service.article.findArticleById(task_id);
      } catch (err) {
        this.ctx.throw(500, `任务查询异常，请稍后重试... ${err.message}`, {
          extra_info: task_id,
        });
      }
    }

    // POST: /api/v1/articles
    async create() {
      const body = this.ctx.request.body;
      try {
        // ps: 由于以前的设计,文章需要关联一个任务结果，目前增加了界面录入功能, 因此写死任务结果=0
        body.taskResult_id = 0;
        const created = await this.service.article.createArticle(body);

        //更新作者的文章量
        let authors = body.author ? body.author.split(',') : [];
        await this.service.author.bulkUpdateAuthrCount(authors);

        this.ctx.status = 201;
        this.ctx.body = created;
      } catch (err) {
        this.ctx.throw(500, `录入文章异常，请稍后重试... ${err.message}`, {
          extra_info: body,
        });
      }
    }


    // DELETE: /api/v1/articles/:id1,:id2,:id3...
    async destroy() {
      let article_ids = this.ctx.params.id; // `GET /api/articles/1,2,3` => `['1', '2', '3']`
      try {
        article_ids = article_ids.split(',');
        this.ctx.body = await this.service.article.deleteArticleByIds(article_ids);

        //TODO 更新作者的文章量
      } catch (err) {
        if (err.message.includes('foreign key constraint')) {
          this.ctx.throw(400, `删除文章异常...:${err.message}`, {
            extra_info: article_ids,
          });
        } else {
          this.ctx.throw(500, `删除文章异常，请稍后重试...:${err.message}`, {
            extra_info: article_ids,
          });
        }
      }
    }

    //PS:仅供内部初始化数据,后面删掉(批量更新作者文章量)
    async bulkUpdateAuthorCount() {
      const from = +this.ctx.query.from;
      const to = +this.ctx.query.to;
      const condition = {where: {id: {}}};
      if (from) {
        condition.where.id[gte] = from
      }
      if (to) {
        condition.where.id[lte] = to
      }
      if (!condition.where.id[lte] && !condition.where.id[gte]) delete condition.where;
      const articles = await this.ctx.model.Article.findAll(condition);
      const map = {};
      articles.forEach((a) => {
        if (a.author) {
          const authors = a.author.split(',');
          authors.forEach((t) => {
            if (!map[t]) {
              map[t] = 0
            }
            map[t] += 1;
          });
        }
      })
      //拼接SQL: update xx set xx=xx case  realname when  '张三' then 3 when '李四' then 4 END
      let whenSQL = '';
      const realnames = [];
      for (let realname in map) {
        if (!realname || realname.includes('\'')) continue; //无法处理
        whenSQL += `WHEN '${realname}' then ${map[realname]} `
        realnames.push(realname);
      }

      //eg: where realname in (xx,xx,...) or realname in (xx,xx,...)
      let inSQL = '';
      const groupArr = this.service.userCollection.groupByLength(realnames, 1000);
      for (let i = 0; i < groupArr.length; i++) {
        inSQL += `realname in ('${groupArr[i].toString().replace(/,/g, '\',\'')}') OR `;
      }
      inSQL = inSQL.replace(/OR $/, '');

      const SQL = `update authors  set article_count= CASE realname ${whenSQL} END
       where ${inSQL} `;
      this.ctx.body = await app.model.query(SQL, {type: app.model.QueryTypes.UPDATE});
      console.log('更新成功')
    }


  }

  return ArticleController;
};
