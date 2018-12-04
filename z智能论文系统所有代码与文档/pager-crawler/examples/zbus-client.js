const zbus = require('zbus');
const MqClient = zbus.MqClient;
const logger = zbus.logger;

logger.level = logger.DEBUG; // from zbus.js


// client.connect()
// client.invoke({cmd:xxx})
// client.query(msg)
// client.empty(msg)
// client.declare(msg)
// client.remove(msg)
// client.produce(msg)
// client.consume(msg)
async function example() {

  const client = new MqClient('localhost:15555');
  await client.connect();

  let res = await client.invoke({ cmd: 'server' });
  console.log('res:' + JSON.stringify(res));
  res = await client.query('MyTopic');
  console.log('MyTopic:' + JSON.stringify(res));

  await client.declare('hongx2');// topic声明
  await client.remove('hongx2');

  await client.produce({ topic: 'MyTopic', body: 'hello from js async/await' });
  const msg = await client.consume({ topic: 'MyTopic' });
  console.log('body:' + msg.body);

  client.close();
}

example();
