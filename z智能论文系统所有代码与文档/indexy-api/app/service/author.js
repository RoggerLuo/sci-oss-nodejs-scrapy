'use strict';

// http://docs.sequelizejs.com/class/lib/model.js~Model.html

module.exports = app => {

  const {in: opIn, like} = app.Sequelize.Op;

  class AuthorService extends app.Service {
    /**
     * 分页获取作者列表
     * @method findAuthors
     * @param  {[type]}  page {where:xx,offset:page*size,limit:size}
     * @return {Promise}      [description]
     */
    async findAuthors(page) {
      return await this.ctx.model.Author.findAndCountAll(page);
    }

    /**
     * [findAuthorsWithFollow 分页获取作者列表]
     * @param  {[type]}  userId [description]
     * @param  {[type]}  page   [{offset:page*size,limit:size}]
     * @return {Promise}        [description]
     */
    async findAuthorsWithFollow(userId, search, page) {

      let sql = `select a.id,a.realname,a.nickname,a.article_count as articleCount,a.fans,
      uA.author_id as authorId from authors a left join user_authors uA on  a.id=uA.author_id and uA.user_id=${userId}`;

      let condition = {};

      const pageSQL = ` limit ${page.offset} , ${page.limit};`

      if (!!search) {
        sql += ` where a.realname like '%${search}%' `;
        condition = {where: {realname: {[like]: `%${search}%`}}};
      }

      // 使用left join 可以判断作者是否被用户关注了
      const authors = await app.model.query(sql + pageSQL,
        {type: app.model.QueryTypes.SELECT}
      );

      const count = await this.ctx.model.Author.count(condition);

      // boolean类型在mysql存储的值为0,1 对isFollow字段统一返回:false:用户已屏蔽,true:用户已关注,null:用户未关注
      authors.forEach(t => {
        if (!!t.authorId) {
          t.isFollow = true;
        } else {
          t.isFollow = false;
        }
        delete t.authorId;
      });
      return {rows: authors, count};
    }


    /**
     * [findListByAuthorNames 查询作者]
     * @param  {[type]}  authors [作者名称 数组]
     * @return {Promise}       [description]
     */
    async findListByAuthorNames(authors) {
      return await this.ctx.model.Author.findAll({where: {realname: {$in: authors}}});
    }

    /**
     * 根据名称分页获取作者信息
     * @param authors
     * @returns {Promise<*>}
     */
    async findPageByAuthorNames(authors, page, size) {
      return await this.ctx.model.Author.findAndCountAll({
        where: {realname: {$in: authors}},
        offset: page * size,
        limit: size
      });
    }

    /**
     * 根据id获取用户
     * @method findAuthorById
     * @param  {[type]}     id [description]
     * @return {Promise}       [description]
     */
    async findAuthorById(id) {
      return await this.ctx.model.Author.findById(id);
    }

    /**
     * 根据作者名称返回作者id
     * @param name
     * @returns {Promise<*>}
     */
    async findAuthorIdByName(name) {
      return await this.ctx.model.Author.findOne({where: {realname: name}, attributes: ["id"]});
    }


    /*
     * 创建作者
     * @method createAuthor
     * @param  {[type]}   Author [description]
     * @return {Promise}       [description]
     */
    async createAuthor(author) {
      return await this.ctx.model.Author.create(author);
    }


    /**
     * 根据id更新作者
     * @method updateAuthorById
     * @param  {[type]}       id      [description]
     * @param  {[type]}       updates [description]
     * @return {Promise}              [description]
     */
    async updateAuthorById(id, updates) {
      return await this.ctx.model.Author.update(updates, {
        where: {
          id,
        },
      });
    }


    /**
     * 根据id数组删除作者
     * @method deleteAuthorByIds
     * @param  {[type]}        ids [description]
     * @return {Promise}           [description]
     */
    async deleteAuthorByIds(ids) {
      return await this.ctx.model.Author.destroy({
        where: {
          id: {
            [opIn]: ids,
          },
        },
      });
    }


  }

  return AuthorService;
};
