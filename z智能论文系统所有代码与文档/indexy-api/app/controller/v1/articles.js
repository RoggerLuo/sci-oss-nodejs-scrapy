'use strict';

// Restful Api 加载形式，详见：
// https://eggjs.org/zh-cn/basics/router.html
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const fs = require('fs');
const mineType = require('mime-types');

module.exports = app => {

  const {or, and, like, notLike, notIn, in: opIn} = app.Sequelize.Op;
  const exactMap = {true: '', false: '%'};//精确查询
  const operatorMap = {and: and, or: or, notContain: and};//操作符
  const likeMap = {notContain: notLike, and: like, or: like};
  const pdfSubject = app.config.nats.subject;

  class ArticleController extends app.Controller {

    // GET: /api/v1/users/:userId/articles
    async findPageArticles({page = 0, size = 10, orders = ['publishTime,desc']}) {
      this.logger.info(`分页获取领域文章:${JSON.stringify(this.ctx.query)}`);

      const userId = this.ctx.params.userId;
      const query = this.ctx.query;
      if (query.page) page = +query.page;
      if (query.size) size = +query.size;
      if (this.ctx.queries.order) orders = this.ctx.queries.order;

      const ords = orders.map(item => { // [["id","desc"]]
        return item.trim().split(',');
      });
      this.logger.debug(ords);

      const condition = {
        offset: page * size,
        limit: size,
        order: ords,
        where: {}
      };
      // if (query.title) {
      //   if (!condition.where) condition.where = {};
      //   condition.where.title = {
      //     [like]: `%${query.title}%`,
      //   };
      // }
      // if (query.journal) {
      //   if (!condition.where) condition.where = {};
      //   condition.where.journal = {
      //     [like]: `%${query.journal}%`,
      //   };
      // }
      // if (query.author) {
      //   if (!condition.where) condition.where = {};
      //   condition.where.author = {
      //     [like]: `%${query.author}%`,
      //   };
      // }
      // if (query.tags) {
      //   if (!condition.where) condition.where = {};
      //
      //   const tags = query.tags.split(',');
      //   const orCondition = [];
      //   tags.map(tag => {
      //     const cond = {
      //       tags: {
      //         [like]: '%' + tag + '%',
      //       },
      //     };
      //     return orCondition.push(cond);
      //   });
      //   condition.where[or] = orCondition;
      // }

      //去掉用户屏蔽的文章
      const dArticleIds = await this.service.userDisincline.findDisinclineArticleIdsByUserId(userId);
      if (dArticleIds.length > 0) {
        condition.where.id = {
          [notIn]: dArticleIds
        }
      }

      //模糊搜索,搜索条件:title,journal,author,summary
      if (query.search) {
        condition.where[or] = [{title: {[like]: `%${query.search}%`}},
          {journal: {[like]: `%${query.search}%`}},
          {author: {[like]: `%${query.search}%`}},
          {summary: {[like]: `%${query.search}%`}}]
      }
      this.ctx.logger.debug(condition);

      try {
        this.ctx.body = await this.service.article.findArticles(condition);
      } catch (err) {
        this.ctx.throw(500, `获取数据失败，请稍后再试...${err.message}`);
      }
    }

    // GET: /api/v1/users/:userId/articles/:id
    async findById() {
      this.logger.info(`获取文章详情:${JSON.stringify(this.ctx.params)}`);

      const userId = +this.ctx.params.userId;
      const articleId = +this.ctx.params.id;

      this.ctx.body = await this.service.article.findArticleById(articleId);

      if (!this.ctx.body) this.ctx.throw(400, "获取文章详情异常,不存在该文章:" + articleId);
      try {
        const task = await this.service.task.findTaskByName(this.ctx.body.journal)
        if (task) this.ctx.body.setDataValue('journalId', task.id);

        //是否收藏
        const uCollection = await this.service.userCollection.findUserCollectionByUserIdAndArticleId(userId, articleId);
        if (!!uCollection) {
          this.ctx.body.setDataValue('isCollection', true);
          this.ctx.body.setDataValue('collectionLabelIds', uCollection.labelIds ? uCollection.labelIds.split(',') : []);
          this.ctx.body.setDataValue('readStatus', uCollection.status);
        } else {
          this.ctx.body.setDataValue('isCollection', false);
          this.ctx.body.setDataValue('collectionLabelIds', []);
          this.ctx.body.setDataValue('readStatus', null);
        }

      } catch (err) {
        this.ctx.throw(500, `任务查询异常，请稍后重试... ${err.message}`, {
          extra_info: articleId,
        });
      }
    }

    // post: /api/v1/articles/:id/uploadPDF
    async upload() {
      const ctx = this.ctx;
      const stream = await ctx.getFileStream();
      const name = `${new Date().getTime()}_${path.basename(stream.filename)}`;
      const pdfUrl = `${app.baseDir}/pdf/${name}`;
      const id = ctx.params.id;
      try {
        fs.writeFileSync(pdfUrl, stream);
        await this.service.article.updateArticleById(id, {pdfUrl});
      } catch (err) {
        // must consume the stream, otherwise browser will be stuck.
        await sendToWormhole(stream);
        this.ctx.throw(500, `上传文件或保存数据失败，请稍后再试...${err.message}`);
      }

      ctx.body = {
        name,
      };
    }

    //deprecated
    // PUT: /api/v1/articles/:id/watch
    async watch() {
      try {
        const id = this.ctx.params.id;
        this.ctx.body = await this.service.article.updateArticleById(id, {watch: app.model.literal('`watch` + 1')});
      } catch (err) {
        this.ctx.throw(500, `请求全文失败，请稍后再试...${err.message}`);
      }

    }

    /**
     * 获取首页的文章列表
     * @returns {Promise<void>}
     */
    //GET /api/v1/users/:userId/articles/index
    async findIndexArticles({page = 0, size = 5, orders = ['publishTime,desc']}) {
      this.logger.info(`获取首页的文章列表:${JSON.stringify(this.ctx.params)}`);

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
        where: {}
      };

      const userId = +this.ctx.params.userId;
      const topics = await this.service.topic.findUserTopicList(userId);

      //去掉用户屏蔽的文章
      const dArticleIds = await this.service.userDisincline.findDisinclineArticleIdsByUserId(userId);
      if (dArticleIds.length > 0) {
        condition.where.id = {
          [notIn]: dArticleIds
        }
      }

      //目前展示用户定制的主题的文章
      if (topics && topics.length > 0) {
        const allTopicsCondition = [];//所有主题之间的条件用or连接
        for (let i = 0; i < topics.length; i++) {
          let tCondition = {};
          const topic = topics[i];
          //TODO 精确查询时仍有些问题
          //篇名，关键字，摘要 组合查询,拼接SQL:title-->operatorTitle-->keyword-->operatorkeyword-->abstract
          const fieldMap = {};
          const keyArr = ['title', 'keyword', 'abstract'];
          for (let i = 0; i < keyArr.length; i++) {//eg:{'title':{like:'%content%'}}
            const item = keyArr[i];
            const likeKey = (i == 0 ? like : likeMap[topic[keyArr[i - 1]].operator]);
            fieldMap[item] = {
              [likeKey]: exactMap[topic[item].exact] +
              (topic[item].content ? topic[item].content : '') + exactMap[topic[item].exact]
            } //eg: {like:'%内容%'}
          }

          if (topic.title.operator == 'or') {
            if (topic.keyword.operator == 'or') {
              tCondition = {
                [or]: [{title: fieldMap['title']}, {keywords: fieldMap['keyword']},
                  {summary: fieldMap['abstract']}]
              } // a or b or c
            } else {
              tCondition = {
                [or]: [{title: fieldMap['title']}, {keywords: fieldMap['keyword']}],
                summary: fieldMap['abstract']
              } // a or b and c
            }
          } else {
            tCondition = {
              title: fieldMap['title'], keywords: fieldMap['keyword'],
              [operatorMap[topic.keyword.operator]]: [{summary: fieldMap['abstract']}]
            } //eg: a and b or c
          }

          allTopicsCondition.push(tCondition);
          console.log(`fieldMap:${JSON.stringify(fieldMap)}`);
        }
        condition.where[or] = allTopicsCondition;
      }

      //关注的期刊
      const journals = await this.service.userTask.findJournalNameByUserId(userId);
      if (journals && journals.length > 0) {
        const jcondition = {journal: {[opIn]: journals}}
        if (condition.where[or]) {
          condition.where[or].push(jcondition);
        } else {
          condition.where[or] = [jcondition];
        }
      }

      //关注的作者
      const authors = await this.service.userAuthor.findAuthorNamesByUserId(userId);
      if (authors && authors.length > 0) {
        //concat(',',field,',') regexp concat(',(',replace('张石宇,庄礼珂',',','|'),'),');
        const acondition = app.model.literal('concat(\',\',`author`,\',\') regexp concat(\',(\',' +
          'replace(\'' + authors.toString() + '\',\',\',\'|\'),\'),\')');
        if (condition.where[or]) {
          condition.where[or].push(acondition);
        } else {
          condition.where[or] = [acondition];
        }
      }

      console.log(`condition.where[or]:${JSON.stringify(condition.where[or])}`);
      console.log(`condition:${JSON.stringify(condition)}`);
      this.ctx.body = await this.service.article.findArticleList(condition);

    }

    /**
     * 获取首页-为你推荐的文章
     * @returns {Promise<void>}
     */
    //GET /api/v1/users/:uid/articles/recommend
    async findRecommandArticles() {

    }

    /**
     * 用户屏蔽文章
     * @returns {Promise<void>}
     */
    //POST /api/v1/users/:userId/userDisincline
    async disinclineArticle() {
      this.logger.info(`用户屏蔽文章:${JSON.stringify(this.ctx.params)}`);

      const userId = this.ctx.params.userId;
      const body = this.ctx.request.body;
      if (!body.articleId) this.ctx.throw(400, `articleId:${articleId}不能为空`);

      const hasDisincline = await this.service.userDisincline.hasDisincline(userId, body.articleId);
      if (hasDisincline) this.ctx.throw(400, `文章已经被屏蔽!`);

      body.userId = userId;
      this.ctx.body = await this.service.userDisincline.createUserDisincline(body);
    }

    /**
     * 下载pdf or 在线阅读
     *
     * 参考:https://www.zhihu.com/question/59351806/answer/177192879
     * http://blog.csdn.net/dong123dddd/article/details/51727238
     * @returns {Promise<void>}
     */
    //GET /api/v1/users/:userId/articles/:id/pdf?download=xxxx
    async getArticlePdf() {
      const download = this.ctx.query.download == 'true';//字符串转boolean
      const articleId = this.ctx.params.id;
      const article = await this.service.article.findArticleById(articleId);
      const filePath = path.resolve(this.app.config.static.dir, 'articles', article.pdfUrl);

      if (!article.pdfUrl || !fs.existsSync(filePath)) this.ctx.throw(400, `下载pdf/在线阅读${article.pdfUrl}失败:不存在该文件:${filePath}`);

      try {
        this.ctx.attachment(article.pdfUrl);
        this.ctx.set('Content-Type', 'application/octet-stream');
        this.ctx.body = fs.createReadStream(filePath);
        if (download) { // 统计下载量
          await this.service.article.updateArticleById(articleId, {downloadCount: app.model.literal('`downloadCount` + 1')})
        }
      } catch (err) {
        console.error(`下载pdf/在线阅读${article.pdfUrl}失败:${err.message}`);
        this.ctx.throw(err.status || 500, `下载pdf/在线阅读${article.pdfUrl}失败:${err.message}`);
      }

    }


    /**
     * 请求全文:重新触发pdf爬虫程序
     * @returns {Promise<void>}
     */
    //GET /api/v1/users/:userId/articles/:id/fulltext
    async scraperPdf() {
      const articleId = this.ctx.params.id;
      const article = await this.service.article.findArticleById(articleId);
      if (!!article.pdfUrl) throw this.ctx.throw(400, "已经存在pdf文件");

      // 发布 操作定时任务 信号
      if (article.doiCode) {
        app.nc.publish(pdfSubject, JSON.stringify({doiCode: article.doiCode, id: articleId}), (err, guid) => {
          this.logger.debug(`文章doiCode(${article.doiCode})发布 Ack: ${guid || err}`);
          console.log(`文章doiCode(${article.doiCode})发布 Ack: ${guid || err}`);
        });
        this.ctx.body = '正在处理,请等待一段时间';
      } else {
        throw this.ctx.throw(400, "不存在doiCode,不能获取全文");
      }

    }

  }

  return ArticleController;
}
;
