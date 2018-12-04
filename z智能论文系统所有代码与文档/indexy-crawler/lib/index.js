'use strict';

const config = require('../config'),
  Scraper = require('../scraper/scraper.js'),
  nc = require('../nats-client/nc.js'),
  taskResult = require('./service/taskResult.js'),
  taskResultModel = require('./model/taskResult.js'),
  taskService = require('./service/task.js');

// connect to mysql
require('./model/sequelize-db');

const {subject, queueGroup} = config.nats.articlesCrawler.subscript;
const {durableName, deliverAllAvailable, maxInFlight, ackWait, manualAckMode} = config.nats.articlesCrawler.subscript.subscriptionOptions;

const schedule = require('node-schedule');
const _schedule_objects = {}, // TODO 暂时只单进程
  timer_subject = 'task.timer',
  timer_queueGroup = 'timer.worker';

nc.on('connect', async _nats_stream => {
  console.log('nats_stream client connected');
  console.log('nc === _nats_stream：%s', _nats_stream === nc);

  const opts = nc.subscriptionOptions();
  // 只消费持久名称 durableName 且客户端还未ack过的消息；即增量式消费
  opts.setDurableName(durableName);
  if (deliverAllAvailable) opts.setDeliverAllAvailable();
  // ps：消费者并发性在服务器设置，即某个topic只能连多少个消费者
  opts.setMaxInFlight(maxInFlight); // 消费者内部阻塞上限，消费者队列
  if (manualAckMode) opts.setManualAckMode(true); // 手动ack模式
  if (ackWait) opts.setAckWait(ackWait);


  // step1 订阅消息服务 subject主题
  const durableSub = nc.subscribe(subject, queueGroup, opts);

  // step2 消息服务器 subject主题 发布消息
  durableSub.on('message', async msg => {
    console.log('Received a message: ' + msg.getData()); // result_id

    try {
      const task_result = await taskResult.findTaskResultById(msg.getData());
      if (task_result.state === taskResultModel.Succeed || task_result.state === taskResultModel.Failure) return;

      const task = task_result.task;
      const _options = task.options ? JSON.parse(task.options) : {}; // 配置
      const flowConfig = _options.crawler_opts;
      const journal = task.name;
      // const taskConfig = _options.task_opts;
      // const natsConfig = _options.nats_opts;

      const scraperConfig = JSON.parse(task.fields); // 字段
      scraperConfig[0].target = task.url;
      console.info('开始运行爬虫引擎 ^_^');
      await _scraperAndSave(task_result, scraperConfig, flowConfig, journal);

    } catch (err) {
      console.error('任务查询异常： ' + err.message);
    } finally {
      msg.ack();
      console.log('task finished : ' + msg.getData());
    }
  });


  /**
   * 定时任务
   */

    // step1 订阅消息服务 subject主题
  const durableSub2 = nc.subscribe(timer_subject, timer_queueGroup, opts);

  // step2 消息服务器 subject主题 发布消息
  durableSub2.on('message', async msg => {
    console.log('Received a message: ' + msg.getData()); // task_id

    try {
      const task = await taskService.findTaskById(msg.getData());
      const _options = task.options ? JSON.parse(task.options) : {};

      if (_options.task_opts && _options.task_opts.schedule && _options.task_opts.cron) { // 设置定时
        try {
          // 新增任务结果 --> 定时运行
          const created = await taskResult.createTaskResult(task.id, taskResultModel.Delayed);
          const journal = task.name;
          const flowConfig = _options.crawler_opts;
          const scraperConfig = JSON.parse(task.fields);
          scraperConfig[0].target = task.url;
          // 启动定时任务
          console.info('启动定时任务 ^_^');
          const job = schedule.scheduleJob(_options.task_opts.cron, async () => {
            await _scraperAndSave(created, scraperConfig, flowConfig, journal);
          });
          _schedule_objects[task.id] = job;
        } catch (e) {
          console.error('定时任务异常：%s', e);
        }
      } else if (_options.task_opts && _options.task_opts.schedule === false) { // 取消定时
        try {
          console.info('开始取消定时任务 T_T');
          _schedule_objects[task.id].cancel();
          await taskResult.updateTaskResultByTaskIdAndDelayed(task.id, {state: taskResultModel.Canceled}); // 把所有 Delayed 相关的任务取消
          console.log('成功取消定时任务：%s', task.id);
        } catch (e) {
          console.error('定时任务取消异常：%s', e);
        }
      } else {
        console.error('定时任务，参数设置有误... %s', _options.task_opts);
      }
    } catch (err) {
      console.error('任务查询异常： ' + err.message);
    } finally {
      msg.ack();
      console.log('task finished : ' + msg.getData());
    }
  });

  console.log('Nats-stream-client listening on [' + subject + ']');
});


/**
 * 内部方法：爬取并更新任务
 * @private
 * @method      _scraperAndSave
 * @param       {[type]}        task_result   [description]
 * @param       {[type]}        scraperConfig [description]
 * @param       {[type]}        flowConfig    [description]
 * @param       {[type]}        journal       [description]
 * @constructor
 */
async function _scraperAndSave(task_result, scraperConfig, flowConfig, journal) {
  try {
    // status -> 活动
    await taskResult.updateTaskResultById(task_result.id, {
      state: taskResultModel.Active,
    });

    // 启动爬虫
    const scraper = new Scraper();
    await scraper.beginScraper(scraperConfig, flowConfig, task_result.id, journal);

    // status -> 成功
    await taskResult.updateTaskResultById(task_result.id, {
      state: taskResultModel.Succeed,
      description: '任务成功.',
    });

  } catch (e) {
    console.error('爬虫任务异常： ' + e.message);
    try {
      // status -> 成功 / 失败
      await taskResult.updateTaskResultById(task_result.id, {
        state: taskResultModel.Failure,
        description: e.message,
      });
    } catch (err) {
      console.error(`更新任务 ${task_result.id} 状态为 ${taskResultModel.Failure}，失败原因：${err.message}`);
    }
  }
}
