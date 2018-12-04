'use-strict';

const cluster_id = 'test-cluster';
const client_id = 'node-stan-pub_doi';
const server = 'nats://114.67.159.3:4222';

const stan = require('node-nats-streaming').connect(cluster_id, client_id, server);

test();

const doiCodes = ["https://doi.org/10.1007/s41348-017-0077-9"
  , '10.1093/aob/mcx130']

async function test() {
  console.log('preparing to publish......');
  await sleep(5000); // 等待连接完成
  for (let i = 0; i < 1; i++) {
    const message = JSON.stringify({doiCode: doiCodes[i], id: 1});
    stan.publish('indexy.articlesDoi', message, function (err, guid) {
      if (err) {
        console.log('publish failed: ' + err);
      } else {
        console.log(`published message(${message + Math.random()}) with guid: ${guid}`);
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
