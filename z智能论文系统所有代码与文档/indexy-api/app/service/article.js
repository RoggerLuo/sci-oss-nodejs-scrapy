'use strict';

// http://docs.sequelizejs.com/class/lib/model.js~Model.html

module.exports = app => {
  // const { in: opIn } = app.Sequelize.Op;

  class Article extends app.Service {

    /**
     * 分页获取文章列表
     * @method findArticles
     * @param  {[type]}  page {where:xx,offset:page*size,limit:size}
     * @return {Promise}      [description]
     */
    async findArticles(page) {
      return await this.ctx.model.Article.findAndCountAll(page);
    }

    /**
     * 获取文章列表
     * @param condition
     * @returns {Promise<*>}
     */
    async findArticleList(condition) {
      return await this.ctx.model.Article.findAll(condition);
    }

    /**
     * 根据id获取文章
     * @method findArticleById
     * @param  {[type]}        id [description]
     * @return {Promise}          [description]
     */
    async findArticleById(id) {
      return await this.ctx.model.Article.findById(id);
    }

    /**
     *根据作者 分页查找文章
     * @param authors
     * @param userId :用户id
     * @param page
     * @returns {Promise<{rows: *, count: number}>}
     */

    // 根据作者查找文章 TODO 排序
    async findArticlesOfAuthorNames(userId, authors, page) {

      // 选出包含作者名的文章
      // const articleTables = `(select id from (select id, (concat(author, ',')   regexp
      // concat(replace('${authors.toString()}',',',',|'), ',')) as flag
      //   FROM articles) A where A.flag!=0 )`;
      //
      // const articles = await app.model.query(`select * from articles
      //   where id in ${articleTables}  order by publishTime desc  limit ${page.offset} , ${page.limit};`,
      // { type: app.model.QueryTypes.SELECT }
      // );
      // const count = await app.model.query(`select count(*) as count from articles
      //   where id in ${articleTables}`,
      //   {type: app.model.QueryTypes.SELECT}
      // );
      const articles = await app.model.query(`select id,title,publishTime,author from articles where 
      concat(',',author,',') regexp concat(',(',replace('${authors.toString()}',',','|'),'),')
      and  id not in (select article_id from user_disinclines where user_id=${userId})
      order by publishTime desc  limit ${page.offset} , ${page.limit};`
        , {type: app.model.QueryTypes.SELECT})

      const count = await app.model.query(`select count(*) as count from articles
        where concat(',',author,',') regexp concat(',(',replace('${authors.toString()}',',','|'),'),')
        and  id not in (select article_id from user_disinclines where user_id=${userId})`,
        {type: app.model.QueryTypes.SELECT});

      return {rows: articles, count: count && count.length > 0 ? count[0].count : 0};
    }


    /**
     * 获取作者最新一篇文章
     * @param userId
     * @param author
     * @returns {Promise<void>}
     */
    async findLatestArticleByAuthor(userId, author) {
      const articles = await app.model.query(`select id,title,publishTime,author from articles where 
      concat(',',author,',') regexp concat(',(',replace('${author}',',','|'),'),')
      and  id not in (select article_id from user_disinclines where user_id=${userId})
      order by publishTime desc  limit 0,1;`
        , {type: app.model.QueryTypes.SELECT})
      return articles.length == 0 ? {} : articles[0];
    }

    // 根据领域查找文章 TODO 排序
    async findArticlesOfFieldNames(fields, page) {

      // 选出包含领域的文章
      const articleTables = `(select id from (select id, (concat(tags, ',')   regexp
      concat(replace('${fields.toString()}',',',',|'), ',')) as flag
        FROM articles) A where A.flag!=0 )`;

      const articles = await app.model.query(`select * from articles
        where id in ${articleTables} order by publishTime desc   limit ${page.offset} , ${page.limit};`,
        {type: app.model.QueryTypes.SELECT}
      );

      const count = await app.model.query(`select count(*) as count from articles
        where id in ${articleTables}`,
        {type: app.model.QueryTypes.SELECT}
      );

      return {rows: articles, count: count && count.length > 0 ? count[0].count : 0};
    }

    /**
     * 分页获取用户收藏的文章列表
     *
     * ps:由于labelIds字段在收藏表中是一个数组，因此采用了sql查询方式
     * @param userId :not null
     * @param status
     * @param labelId
     * @param page
     * @param size
     * @param order
     * @returns {Promise<void>}
     */
    async findPageArticlesByUserCollection(userId, status, labelId, page, size) {
      let sql = `select a.id,a.title,a.publishTime,uc.status,uc.label_ids as labelIds from articles a,user_collections uc
        where a.id=uc.article_id and uc.user_id=${userId}`;

      let countSQL = `select count(*) as count from user_collections uc
        where uc.user_id=${userId}`;

      if (!!status) {
        sql += ` and uc.status='${status}'`;
        countSQL += ` and uc.status='${status}'`;
      }
      if (!!labelId) {//eg:'1,11,2,3' 与 '11' 是否含有交集==》true (11)
        sql += ` and concat(',',uc.label_ids,',') regexp concat(',(',replace('${labelId}',',','|'),'),')`;
        countSQL += ` and concat(',',uc.label_ids,',') regexp concat(',(',replace('${labelId}',',','|'),'),')`;
      }
      const pageSQL = ` order by a.publishTime desc   limit ${page * size} , ${size}`;
      const articles = await app.model.query(sql + pageSQL,
        {type: app.model.QueryTypes.SELECT}
      );

      const count = await app.model.query(countSQL, {type: app.model.QueryTypes.SELECT});

      return {rows: articles, count: count && count.length > 0 ? count[0].count : 0};
    }


    /**
     * 根据id更新文章
     * @method updateArticleById
     * @param  {[type]}          id      [description]
     * @param  {[type]}          updates [description]
     * @return {Promise}                 [description]
     */
    async updateArticleById(id, updates) {
      return await this.ctx.model.Article.update(updates, {
        where: {
          id,
        },
      });
    }
  }

  return Article;
};
