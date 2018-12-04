'use strict';

module.exports = app => {

  const APP_CONTEXT = 'indexy_api';

  const payload = app.middlewares.payload(); // 统一消息体

  app.get('/', app.controller.v1.index.index);

  /**
   * 文章管理相关接口
   */
  // app.resources('articles', `/${APP_CONTEXT}/api/v1/articles`, payload, app.controller.v1.articles);

  //获取文章列表
  app.get(`/${APP_CONTEXT}/api/v1/users/:userId/articles/`, payload, app.controller.v1.articles.findPageArticles);
  //获取文章详情
  app.get(`/${APP_CONTEXT}/api/v1/users/:userId/articles/:id`, payload, app.controller.v1.articles.findById);
  //获取首页的文章列表
  app.get(`/${APP_CONTEXT}/api/v1/users/:userId/index/articles`, payload, app.controller.v1.articles.findIndexArticles);
  //用户屏蔽文章
  app.post(`/${APP_CONTEXT}/api/v1/users/:userId/userDisincline`, payload, app.controller.v1.articles.disinclineArticle);

  //在线预览/下载pdf
  app.get(`/${APP_CONTEXT}/api/v1/users/:userId/articles/:id/pdf`, app.controller.v1.articles.getArticlePdf);
  //请求全文,触发pdf爬虫
  app.get(`/${APP_CONTEXT}/api/v1/users/:userId/articles/:id/fulltext`, app.controller.v1.articles.scraperPdf);

  app.resources('users', `/${APP_CONTEXT}/api/v1/users`, payload, app.controller.v1.users);

  // app.resources('userTask', `/${APP_CONTEXT}/api/v1/userTasks`, payload, app.controller.v1.userTasks);

  //用户注册
  app.post(`/${APP_CONTEXT}/api/v1/users/register`, payload, app.controller.v1.users.register);

  //用户登录
  app.post(`/${APP_CONTEXT}/api/v1/users/login`, payload, app.controller.v1.users.login);

  //上传pdf
  app.post(`/${APP_CONTEXT}/api/v1/articles/:id/uploadPDF`, payload, app.controller.v1.articles.upload);


  //获取用户订阅期刊的文章列表
  // app.get(`/${APP_CONTEXT}/api/v1/users/:userId/follow/tasks/articles`, payload, app.controller.v1.users.getFollowArticles);

  //deprecated 请求全文
  app.put(`/${APP_CONTEXT}/api/v1/articles/:id/watch`, payload, app.controller.v1.articles.watch);

  /**
   * 领域-相关接口
   */
  // 领域管理
  app.resources('field', `/${APP_CONTEXT}/api/v1/fields`, payload, app.controller.v1.fields);
  // 获取一级领域
  app.get(`/${APP_CONTEXT}/api/v1/fields/firstLevel`, payload, app.controller.v1.fields.getFirstLevelFields);
  // 根据父级id获取子级领域
  app.get(`/${APP_CONTEXT}/api/v1/fields/:id/children`, payload, app.controller.v1.fields.getChildrensByParentId);

  // 根据父级id获取树形子级领域
  app.get(`/${APP_CONTEXT}/api/v1/fields/:id/childrenTree`, payload, app.controller.v1.fields.getChildrenTreeByParentId);

  // 用户关注领域
  app.post(`/${APP_CONTEXT}/api/v1/users/:userId/follow/fields/:fieldId`, payload, app.controller.v1.fields.followField);

  // 用户屏蔽领域
  app.post(`/${APP_CONTEXT}/api/v1/users/:userId/unfollow/fields/:fieldId`, payload, app.controller.v1.fields.unFollowField);

  // 获取用户关注的领域的文章
  app.get(`/${APP_CONTEXT}/api/v1/users/:userId/fields/articles`, payload, app.controller.v1.fields.getFieldLatestArticle);
  // 查看用户是否有关注的领域
  app.get(`/${APP_CONTEXT}/api/v1/users/:userId/hasFollowField`, payload, app.controller.v1.fields.hasFollowField);
  // 获取用户已关注的领域列表
  app.get(`/${APP_CONTEXT}/api/v1/users/:userId/fields`, payload, app.controller.v1.fields.getUserFields);

  /**
   * 期刊相关接口
   */
  // 期刊管理
  app.resources('task', `/${APP_CONTEXT}/api/v1/tasks`, payload, app.controller.v1.tasks);

  //获取用户的定制期刊
  app.get(`/${APP_CONTEXT}/api/v1/users/:userId/userTasks`, payload, app.controller.v1.tasks.getUserJournalList);
  //获取期刊详情
  app.get(`/${APP_CONTEXT}/api/v1/users/:userId/tasks/:id`, payload, app.controller.v1.tasks.findTaskById);

  //分页获取用户订阅的某个期刊定制的文章列表
  app.get(`/${APP_CONTEXT}/api/v1/users/:userId/tasks/:taskId/articles`, payload, app.controller.v1.tasks.getJournalArticles);

  //订阅期刊
  app.post(`/${APP_CONTEXT}/api/v1/users/:userId/tasks/:taskId`, payload, app.controller.v1.tasks.follow);

  //取消订阅期刊
  app.delete(`/${APP_CONTEXT}/api/v1/users/:userId/tasks/:taskId`, payload, app.controller.v1.tasks.cancelFollow);

  /**
   * 作者相关接口
   */
  // 作者管理
  app.resources('authors', `/${APP_CONTEXT}/api/v1/authors`, payload, app.controller.v1.authors);

  //获取作者详情
  app.get(`/${APP_CONTEXT}/api/v1/users/:userId/authors/:id`, payload, app.controller.v1.authors.findAuthorById);
  //根据作者名称获取作者id
  app.get(`/${APP_CONTEXT}/api/v1/users/:userId/authors/:name/id`, payload, app.controller.v1.authors.findAuthorIdByName);

  //分页获取用户的作者定制列表
  app.get(`/${APP_CONTEXT}/api/v1/users/:userId/userAuthors`, payload, app.controller.v1.authors.findUserAuthorByPage);
  //分页获取作者的文章列表
  app.get(`/${APP_CONTEXT}/api/v1/users/:userId/authors/:id/articles`, payload, app.controller.v1.authors.findAuthorArticlesPage);
  //分页获取作者列表
  app.get(`/${APP_CONTEXT}/api/v1/users/:userId/authors`, payload, app.controller.v1.authors.findPageAuthors);
// 用户关注作者
  app.post(`/${APP_CONTEXT}/api/v1/users/:userId/authors/:authorId`, payload, app.controller.v1.authors.followAuthor);

  // 取消关注作者
  app.delete(`/${APP_CONTEXT}/api/v1/users/:userId/authors/:authorId`, payload, app.controller.v1.authors.cancelFollowAuthor);
  // 获取用户关注的作者的文章
  // app.get(`/${APP_CONTEXT}/api/v1/users/:userId/authors/articles`, payload, app.controller.v1.authors.getAuthorLatestArticle);


  /**
   * 收藏标签管理
   */
  //收藏标签分类CRUD
  app.resources('labels', `/${APP_CONTEXT}/api/v1/users/:userId/labels`, payload, app.controller.v1.labels);

  /**
   * 文章收藏管理
   */
  //分页获取用户收藏的文章列表
  app.get(`/${APP_CONTEXT}/api/v1/users/:userId/userCollections`, payload, app.controller.v1.collections.findPageArticlesByUserCollection);

  //收藏文章
  app.post(`/${APP_CONTEXT}/api/v1/users/:userId/userCollections`, payload, app.controller.v1.collections.addUserCollection);
  //修改收藏文章的分类或阅读状态
  app.put(`/${APP_CONTEXT}/api/v1/users/:userId/userCollections`, payload, app.controller.v1.collections.updateCollection);
  //取消收藏
  app.delete(`/${APP_CONTEXT}/api/v1/users/:userId/userCollections`, payload, app.controller.v1.collections.cancelUserCollection);

  /***
   * 主题定制管理
   */
  //主题定制CRUD
  app.resources('topics', `/${APP_CONTEXT}/api/v1/users/:userId/topics`, payload, app.controller.v1.topics);

  //分页获取某个主题定制下的文章
  app.get(`/${APP_CONTEXT}/api/v1/users/:userId/topics/:id/articles`, payload, app.controller.v1.topics.findTopicPageArticles);


};
