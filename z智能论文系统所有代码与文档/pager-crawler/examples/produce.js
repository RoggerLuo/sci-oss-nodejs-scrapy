
const zbus = require('zbus');

const broker = new zbus.Broker('localhost:15555');

const p = new zbus.Producer(broker);

const produceMessage = async () => {
  await p.publish({ topic: 'MyTopic', body: 'Hello, from JS' });

  broker.close();
};

produceMessage();
