'use strict';

// http://docs.sequelizejs.com/class/lib/model.js~Model.html

const TaskResult = require('../model/taskResult');
const Task = require('../model/task');

class TaskResultService {

  /**
	 * 根据id获取任务结果
	 * @method findTaskResultById
	 * @param  {[type]}           id [description]
	 * @return {Promise}             [description]
	 */
  async findTaskResultById(id) {

    const condition = {
      where: {
        id,
      },
      include: {
        model: Task,
        as: 'task',
      },
    };
    return await TaskResult.findOne(condition);
  }

  /**
     * 根据task_id查找上一条的任务结果
     * @param id
     * @returns {Promise.<*>}
     */
  async findPreviousTaskResultByTaskId(id) {
      const condition = {
          where: {
              task_id: id
          },
          order: [
              ["id" , "DESC"],
          ],
          raw: true,
          limit: 2
      };
      let result = await TaskResult.findAll(condition);
      return result[1] || {};
  }


  /**
	 * 根据id更新任务结果
	 * @method updateTaskResultById
	 * @param  {[type]}             id      [description]
	 * @param  {[type]}             updates [description]
	 * @return {Promise}                    [description]
	 */
  async updateTaskResultById(id, updates) {
    return await TaskResult.update(updates, {
      where: {
        id,
      },
    });
  }


  /**
	 * 根据task_id更新任务结果
	 * @method updateTaskResultByTaskIdAndDelayed
	 * @param  {[type]}             task_id      [description]
	 * @param  {[type]}             updates [description]
	 * @return {Promise}                    [description]
	 */
  async updateTaskResultByTaskIdAndDelayed(task_id, updates) {
    return await TaskResult.update(updates, {
      where: { task_id, state: TaskResult.Delayed },
    });
  }


  /**
   * 创建任务结果
   * @method createTaskResult
   * @param  {[int]}         taskId   任务id
   * @param  {[String]}      state    状态
   * @return {Promise}               [description]
   */
  async createTaskResult(taskId, state) {
    const taskResult = {
      task_id: taskId,
      state,
    };
    return await TaskResult.create(taskResult);
  }

}

const taskResultService = new TaskResultService();
module.exports = taskResultService;

// test1()
// test2()
// // async function test1() {
// //   console.log("测试更新:");
// //   let updateRestult = {
// //     state: TaskResult.Delayed
// //   }
// //   let result = await taskResultService.updateTaskResultById(4, updateRestult);
// //   console.log(result)
// // }
//
// async function test2() {
// 	console.log( "测试更新:" );
//
// 	let result = await taskResultService.findTaskResultById( 4 );
// 	console.log( result.state )
// }
