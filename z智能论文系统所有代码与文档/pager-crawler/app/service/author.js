'use strict';

// http://docs.sequelizejs.com/class/lib/model.js~Model.html

module.exports = app => {

  const {in: opIn} = app.Sequelize.Op;

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
     * [findList 查询所有用户]
     * @param  {[type]}  query [description]
     * @return {Promise}       [description]
     */
    async findList(query) {
      return await this.ctx.model.Author.findAll(query);
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


    /*
     * 创建作者
     * @method createAuthor
     * @param  {[type]}   author [description]
     * @return {Promise}       [description]
     */
    async createAuthor(author) {
      return await this.ctx.model.Author.create(author);
    }

    /**
     * [bulkCreateAuthors 批量创建作者]
     * @param  {Array}   [author_array=[]] [description]
     * @return {Promise}                   [description]
     */
    async bulkCreateAuthors(author_array = []) {
      return await this.ctx.model.Author.bulkCreate(author_array);
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
     * 批量更新作者文章量
     *
     * @param authors :['张三','李四']
     */
    async bulkUpdateAuthrCount(authors) {
      if (!authors || authors.length == 0) return null;

      const authorCountObj = {};//{'张三':4,'李四':5}
      for (let i = 0; i < authors.length; i++) {
        const count = await this.ctx.service.article.countByAuthor(authors[i]);
        authorCountObj[authors[i]] = count;
      }

      //拼接SQL: update xx set xx=xx case  realname when  '张三' then 3 when '李四' then 4 END
      let whenSQL = '';
      for (let realname in authorCountObj) {
        whenSQL += `WHEN '${realname}' then ${authorCountObj[realname]}`
      }
      const SQL = `update authors  set article_count= CASE realname ${whenSQL} END 
                    where realname IN ('${authors.toString().replace(/,/g, '\',\'')}')`
      return await app.model.query(SQL, {type: app.model.QueryTypes.UPDATE});

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
