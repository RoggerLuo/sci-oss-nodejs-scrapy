'use strict';

// http://docs.sequelizejs.com/class/lib/model.js~Model.html

const Article = require('../model/article');
const {in: opIn} = require('../model/sequelize-db').Sequelize.Op;

class ArticleService {

  async findById(id) {
    return await Article.findById(id);
  }


  /**
   * 查找文章urls
   * @param urls
   * @returns {Promise<Array<Model>>}
   */
  async findByUrls(urls = []) {
    return await Article.findAll({where: {sourceUrl: {[opIn]: urls}}, attributes: ['sourceUrl']});
  }


  /** http://docs.sequelizejs.com/manual/tutorial/instances.html#working-in-bulk-creating-updating-and-destroying-multiple-rows-at-once-
   *  批量插入文章
   * @method bulkCreateArticles
   * @param  {Array}            [Article_array=[]] [description]
   * @return {Promise}                             [description]
   */
  async bulkCreateArticles(Article_array = []) {
    return await Article.bulkCreate(Article_array);
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

  /**
   *更新pdf的下载状态
   * @param id
   * @returns {Promise<*>}
   */
  // async finishedDownload(id) {
  //   return await Article.update({finishedDownload: true}, {where: {id}});
  // }

}

const articleService = new ArticleService();
module.exports = articleService;

// test()
//
// async function test() {
//   console.log("测试文章插入:");
//   let testArticle = {
//     taskResult_id: 8,
//     title: 'test',
//     summary: 'test',
//     author: 'test',
//     sourceUrl: 'http://foo.com',
//     publishTime: '2017-10-27 07:25:20'
//   }
//   let result = await articleService.bulkCreateArticles([testArticle]);
//   console.log(result)
// }
