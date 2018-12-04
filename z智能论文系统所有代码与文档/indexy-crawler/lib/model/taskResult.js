'use strict';

const sequelize = require('./sequelize-db');
const Task = require('./task');

const { STRING, INTEGER, ENUM, DATE } = sequelize.Sequelize;

const TaskResult = sequelize.define('task_result', {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },

  task_id: { type: INTEGER, allowNull: false },

  state: { type: ENUM('Delayed', 'Queued', 'Active', 'Canceled', 'Succeed', 'Failure'), defaultValue: 'Queued' },
  // result: { type: BOOLEAN, allowNull: false, defaultValue: true },  // T成功，F失败
  middles: STRING, // 中间结构
  progress: STRING, // 最新一条
  description: STRING, 	// 失败原因/额外信息
  createdAt: { type: DATE, field: 'created_at' }, // 采用直接new Sequelize()的方式默认sql插入的字段为createdAt,需要跟egg默认的created_at适配
  updatedAt: { type: DATE, field: 'updated_at' },
});

// 外键关联
// TaskResult.associate = () => {
//   TaskResult.belongsTo(Task, {as: 'task', foreignKey: 'task_id'});
// };

TaskResult.belongsTo(Task, { as: 'task', foreignKey: 'task_id' });

TaskResult.Delayed = 'Delayed'; // 延迟
TaskResult.Queued = 'Queued'; // 排队
TaskResult.Active = 'Active'; // 活动
TaskResult.Canceled = 'Canceled'; // 取消
TaskResult.Succeed = 'Succeed'; // 成功
TaskResult.Failure = 'Failure'; // 失败

module.exports = TaskResult;
