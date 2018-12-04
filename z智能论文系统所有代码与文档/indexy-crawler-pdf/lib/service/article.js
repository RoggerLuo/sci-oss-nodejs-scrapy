'use strict';

// http://docs.sequelizejs.com/class/lib/model.js~Model.html

const Article = require('../model/article');
const {in: opIn} = require('../model/sequelize-db').Sequelize.Op;

class ArticleService {

  async findById(id) {
    return await Article.findById(id);
  }

  /**
   * 更新文章
   * @method updatePdfUrlById
   * @param  {[type]}      article [description]
   * @return {Promise}             [description]
   */
  async updatePdfUrlById(id, pdfUrl) {
    return await Article.update({pdfUrl}, {where: {id}});
  }


}

const articleService = new ArticleService();
module.exports = articleService;

