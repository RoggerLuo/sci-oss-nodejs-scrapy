'use strict';

// Restful Api 加载形式，详见：
// https://eggjs.org/zh-cn/basics/router.html
/**
 * 主题定制管理相关api
 */

const lodash = require('lodash');


module.exports = app => {
  const {like, notLike, or, and} = app.Sequelize.Op;

  const exactMap = {true: '', false: '%'};//精确查询
  const operatorMap = {and: and, or: or, notContain: and};//操作符
  const likeMap = {notContain: notLike, and: like, or: like};

  class TopicController extends app.Controller {

    /**
     * 分页获取用户主题定制
     * @param page
     * @param size
     * @param orders
     * @returns {Promise<void>}
     */
    //GET /api/v1/users/:userId/topics
    async index({page = 0, size = 10, orders = ['id,desc']}) {
      this.logger.info(`分页查询主题定制:${JSON.stringify(this.ctx.query)}`);

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

      const userId = +this.ctx.params.userId;
      condition.where = {userId};

      try {
        this.ctx.body = await this.service.topic.findTopics(condition);
      } catch (err) {
        this.logger.error(JSON.stringify(err));
        this.ctx.throw(500, `分页查询主题定制异常，请稍后重试... ${err.message}`);
      }
    }

    // GET: /api/v1/users/:userId/topics/:id
    async show() {
      this.logger.info(`查看主题定制详情:${JSON.stringify(this.ctx.params)}`);

      const topicId = +this.ctx.params.id;
      this.ctx.body = await this.service.topic.findTopicById(topicId);
    }


    // POST: /api/v1/users/:userId/topics
    async create() {
      this.logger.info(`新增主题定制:${JSON.stringify(this.ctx.request.body)}`);

      const userId = +this.ctx.params.userId;
      const body = this.ctx.request.body;
      try {
        body.userId = userId;
        const topic = await this.service.topic.createTopic(body);
        this.ctx.body = topic;
      } catch (err) {
        this.logger.error(JSON.stringify(err));
        if (err.message.indexOf('Validation error') >= 0) {
          this.ctx.throw(400, `主题定制信息异常:${err.message}`);
        }
        this.ctx.throw(500, `新增主题定制异常，请稍后重试:${err.message}`);
      }

    }


    // PUT: /api/v1/users/:userId/topics/:id
    async update() {
      this.logger.info(`修改主题定制:${this.ctx.params.id},${JSON.stringify(this.ctx.request.body)}`);

      const userId = +this.ctx.params.userId;
      const topicId = this.ctx.params.id;
      const body = this.ctx.request.body;

      const topic = await this.service.topic.findTopicById(topicId);
      if (!topic || topic.userId != userId) this.ctx.throw(400, `主题定制不存在或不属于当前用户,不允许修改`);
      try {
        this.ctx.body = await this.service.topic.updateTopicById(topicId, body);
      } catch (err) {
        this.logger.error(JSON.stringify(err));

        if (err.message.indexOf('Validation error') >= 0) {
          this.ctx.throw(400, `主题定制信息异常... ${err.message}`);
        }
        this.ctx.throw(500, `修改主题定制信息异常，请稍后重试... ${err.message}`);
      }

    }

    // DELETE: /api/v1/topics/:id1,:id2,:id3...
    async destroy() {
      this.logger.info(`删除主题定制:${this.ctx.params.id}`);

      let topicIds = this.ctx.params.id; // `GET /api/topics/1,2,3` => `['1', '2', '3']`
      topicIds = topicIds.split(',');
      try {
        this.ctx.body = await this.service.topic.deleteTopicByIds(topicIds);
      } catch (err) {
        this.ctx.throw(500, `删除主题定制异常，请稍后重试:${err.message}`);
      }
    }

    //GET /api/v1/users/:uid/topics/:id/articles
    async findTopicPageArticles({page = 0, size = 10, orders = ['id,desc']}) {
      this.logger.info(`分页查询主题下的文章:${JSON.stringify(this.ctx.query)}`);

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

      const userId = +this.ctx.params.userId;
      const topicId = this.ctx.params.id;

      const topic = await this.service.topic.findTopicById(topicId);
      if (!topic) this.ctx.throw(400, `不存在该主题,请求参数异常,topicId::${topicId}`);

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
          condition.where = {
            [or]: [{title: fieldMap['title']}, {keywords: fieldMap['keyword']},
              {summary: fieldMap['abstract']}]
          } // a or b or c
        } else {
          condition.where = {
            [or]: [{title: fieldMap['title']}, {keywords: fieldMap['keyword']}],
            summary: fieldMap['abstract']
          } // a or b and c
        }
      } else {
        condition.where = {
          title: fieldMap['title'], keywords: fieldMap['keyword'],
          [operatorMap[topic.keyword.operator]]: [{summary: fieldMap['abstract']}]
        } //eg: a and b or c
      }
      console.log(fieldMap);
      console.log(JSON.stringify(condition))

      this.ctx.body = await this.service.article.findArticles(condition);
    }

  }

  return TopicController;
};
