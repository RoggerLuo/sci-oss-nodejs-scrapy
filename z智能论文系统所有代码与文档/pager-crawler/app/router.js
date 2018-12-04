'use strict';

module.exports = app => {

  console.log(123)

  const APP_CONTEXT = 'crawler';

  const payload = app.middlewares.payload(); // 统一消息体

  app.post(`/${APP_CONTEXT}/api/v1/tasks/preview`, payload, app.controller.v1.tasks.previewResult);

  app.put(`/${APP_CONTEXT}/api/v1/tasks/:id/schedule`, payload, app.controller.v1.tasks.setSchedule);

  app.resources('tasks', `/${APP_CONTEXT}/api/v1/tasks`, payload, app.controller.v1.tasks);
  // 获取期刊名称列表
  app.get(`/${APP_CONTEXT}/api/v1/tasks/names`, payload, app.controller.v1.tasks.getTaskNames);

  app.resources('taskResults', `/${APP_CONTEXT}/api/v1/taskResults`, payload, app.controller.v1.taskResults);

  app.resources('articles', `/${APP_CONTEXT}/api/v1/articles`, payload, app.controller.v1.articles);

  app.resources('users', `/${APP_CONTEXT}/api/v1/users`, payload, app.controller.v1.users);

  app.resources('authors', `/${APP_CONTEXT}/api/v1/authors`, payload, app.controller.v1.authors);

  //仅供测试
  app.post(`/${APP_CONTEXT}/api/v1/authors/count`, payload, app.controller.v1.articles.bulkUpdateAuthorCount);

  /**
   * 领域-相关接口
   */
  app.resources('fields', `/${APP_CONTEXT}/api/v1/fields`, payload, app.controller.v1.fields);
  // 获取一级领域
  app.get(`/${APP_CONTEXT}/api/v1/fields/firstLevel`, payload, app.controller.v1.fields.getFirstLevelFields);
  // 根据父级id获取子级领域
  app.get(`/${APP_CONTEXT}/api/v1/fields/:id/children`, payload, app.controller.v1.fields.getChildrensByParentId);

  // 根据父级id获取树形子级领域
  app.get(`/${APP_CONTEXT}/api/v1/fields/:id/childrenTree`, payload, app.controller.v1.fields.getChildrenTreeByParentId);


  // app.get(`/${APP_CONTEXT}/api/v1/authors/bulkCreate`, payload, app.controller.v1.authors.bulkCreate);


  // 根路由导航到首页
  // app.redirect("/", "/index.html", 302);
  // ctx.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  // 兼容 HTTP1.0
  // ctx.set('Pragma', 'no-cache');
  // ctx.set('Expires', 0);
  // ctx.type = 'text/html; charset=utf-8';

};
