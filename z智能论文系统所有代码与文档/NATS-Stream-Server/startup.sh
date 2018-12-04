#!/bin/bash

cd `dirname $0`

#删除容器
docker rm -f nats-stream-server &> /dev/null


#启动nats-stream-server,并指定4222(store port),8222(monitor port)
docker run -d -p 4222:4222 -p 8222:8222 \
       -v $PWD/nats-data:/root/datastore \
       --name nats-stream-server nats-streaming \
       -store file -dir /root/datastore --cluster_id=test-cluster \
       -p 4222 -m 8222

