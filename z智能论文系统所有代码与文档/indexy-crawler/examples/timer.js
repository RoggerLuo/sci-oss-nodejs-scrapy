const schedule = require('node-schedule');

let i = 0;

// 每3秒执行一次
const j = schedule.scheduleJob('*/1 * * * * * *', async () => {
  i++;
  // if (i > 4) j.cancel();
  console.log('The answer to life, the universe, and everything! count=%s', i);

});


// for (let i = 0; i < 5; i++) {
//   if (i >= 3) j.cancel();
// }

// Execute a cron job when the minute is 42 (e.g. 19:42, 20:42, etc.).
// const j2 = schedule.scheduleJob('42 * * * *', function() {
//   console.log('The answer to life, the universe, and everything!');
// });
