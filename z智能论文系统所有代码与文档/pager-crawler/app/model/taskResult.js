'use strict';

// const Task = require( './task.js' )();

module.exports = app => {

  const { STRING, INTEGER, ENUM } = app.Sequelize;

  const TaskResult = app.model.define('task_result', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },

    task_id: { type: INTEGER, allowNull: false },

    state: { type: ENUM('Delayed', 'Queued', 'Active', 'Canceled', 'Succeed', 'Failure'), defaultValue: 'Queued' },
    // result: { type: BOOLEAN, allowNull: false, defaultValue: true },  // T成功，F失败
    middles: STRING, // 中间结构
    progress: STRING, // 最新一条
    description: STRING, 	// 失败原因/额外信息
  });

  // 外键关联
  TaskResult.associate = () => {
    app.model.TaskResult.belongsTo(app.model.Task, { as: 'task', foreignKey: 'task_id' });
  };

  TaskResult.Delayed = 'Delayed'; // 延迟
  TaskResult.Queued = 'Queued'; // 排队
  TaskResult.Active = 'Active'; // 活动
  TaskResult.Canceled = 'Canceled'; // 取消
  TaskResult.Succeed = 'Succeed'; // 成功
  TaskResult.Failure = 'Failure'; // 失败

  return TaskResult;

};
