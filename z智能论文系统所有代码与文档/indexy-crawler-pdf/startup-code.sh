#!/bin/bash

cd `dirname $0`

#更新代码
git pull

#构建镜像
docker build -t foreveross/indexy-crawler-pdf .

#删除容器
docker rm -f indexy-crawler-pdf &> /dev/null

docker run -d --restart=on-failure:5 --privileged  \
    -e MYSQL_HOST=139.129.20.182 \
    -e NATS_URL=nats://114.67.159.3:4222 \
    -e FIREFOX_REMOUTE_SERVER=http://192.168.0.4:4444/wd/hub \
    -w /home \
    -v $PWD/logs/:/home/logs/ \
    -v $PWD/node_modules/:/home/node_modules/ \
    -v /home/indexy-pdf:/home/indexy-pdf \
    --name indexy-crawler-pdf foreveross/indexy-crawler-pdf /bin/sh pm2-run.sh

#FIREFOX_REMOUTE_SERVER 必须是局域网ip

