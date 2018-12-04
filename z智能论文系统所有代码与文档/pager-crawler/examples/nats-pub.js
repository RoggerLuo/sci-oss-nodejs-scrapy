'use strict';

const cluster_id = 'test.js-cluster';
const client_id = 'node-stan-pub1';
const server = 'nats://114.67.159.3:4222';

const stan = require('node-nats-streaming').connect(cluster_id, client_id, server);

test();

async function test() {
  console.log('preparing to publish......');
  await sleep(5000); // 等待连接完成
  for (let i = 0; i < 10; i++) {
    stan.publish('foo', 'Hello World!', function(err, guid) {
      if (err) {
        console.log('publish failed: ' + err);
      } else {
        console.log('published message with guid: ' + guid);
      }
    });
  }
}

// 模拟异步请求
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// stan.on('connect', function (){
//   console.log("connecting......")
// });
// stan.on('close', function () {
//   process.exit();
// });
// stan.on('error', function (err) {
//   console.log(err)
// });
