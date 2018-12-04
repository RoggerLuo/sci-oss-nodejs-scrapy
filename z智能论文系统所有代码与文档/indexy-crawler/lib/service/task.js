'use strict';

// http://docs.sequelizejs.com/class/lib/model.js~Model.html

const Task = require('../model/task');

class TaskService {

  /**
	 * 根据id获取任务
	 * @method findTaskById
	 * @param  {[type]}           id [description]
	 * @return {Promise}             [description]
	 */
  async findTaskById(id) {

    const condition = {
      where: {
        id,
      },
    };
    return await Task.findOne(condition);
  }

}

const taskService = new TaskService();
module.exports = taskService;
