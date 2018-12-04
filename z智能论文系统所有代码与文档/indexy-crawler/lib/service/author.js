'use strict';

// http://docs.sequelizejs.com/class/lib/model.js~Model.html

const Author = require('../model/author');
const sequelize = require('../model/sequelize-db');

const {in: opIn} = sequelize.Sequelize.Op;


class AuthorService {


  /**
   * 批量创建作者
   * @param authors
   * @returns {Promise<Array<Model>>}
   */
  async bulkCreateAuthor(authors = []) {
    return await Author.bulkCreate(authors);
  }

  /**
   * 批量更新作者的文章阅读量
   * @param countMap {'张三':2,'李四':3}
   * @returns {Promise<void>}
   *
   * eg:update authors set article_count =article_count+ CASE realname
   WHEN '张石宇' then 1
   WHEN '宋信莉' then 2
   END
   where  realname in ('张石宇','宋信莉')
   */
  async bulkUpdateArticleCount(countMap) {
    const authors = Object.keys(countMap);

    //分组：存在的作者,不存在的作者 ps:由于in查询,authors超过1000会存在问题
    const groupAuthors = this.groupByLength(authors, 1000);
    let existAuthors = [];
    for (let i = 0; i < groupAuthors.length; i++) {
      const temp =await Author.findAll({where: {realname: {[opIn]: authors}}, attributes: ['realname']});
      existAuthors = existAuthors.concat(temp);
    }

    existAuthors = existAuthors.map(a => a.realname);
    const notExist = authors.filter(v => !existAuthors.includes(v));

    if (existAuthors.length > 0) {
      const groupExistAuthors = this.groupByLength(existAuthors, 1000);
      for (let j = 0; j < groupExistAuthors.length; j++) {
        let whenSQL = '';
        for (let i = 0; i < groupExistAuthors[j].length; i++) {
          whenSQL += `WHEN '${groupExistAuthors[j][i]}' then ${countMap[groupExistAuthors[j][i]]} `
        }

        //authors.toString().replace(/,/g,'\',\'') eg: [1,2,3]=> 1','2','3
        const SQL = `update authors  set article_count=article_count+ CASE realname 
                  ${whenSQL} END where realname IN ('${groupExistAuthors[j].toString().replace(/,/g, '\',\'')}')`;
        await sequelize.query(SQL, {type: sequelize.QueryTypes.SELECT});
      }
    }

    if (notExist.length > 0) {
      const groupNotExist = this.groupByLength(notExist, 1000);
      for (let j = 0; j < groupNotExist.length; j++) {
        const newAuthors = groupNotExist[j].map((name) => {
          return {realname: name, nickname: name, articleCount: countMap[name]}
        })
        await this.bulkCreateAuthor(newAuthors);
      }
    }
    return true;
  }

  /**
   * 对数组按长度分组
   * @param array
   * @param length
   * @returns {Array}
   */
  groupByLength(array = [], length) {
    const groupArr = [];
    if (array.length > length) {
      for (let i = 0; i < Math.ceil(array.length / length); i++) {
        groupArr[i] = array.slice(i * length, (i + 1) * length);
      }
      return groupArr;
    }
    groupArr[0] = array;
    return groupArr;
  }


}

const authorService = new AuthorService();
module.exports = authorService;
