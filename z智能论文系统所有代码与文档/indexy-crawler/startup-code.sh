#!/bin/bash

cd `dirname $0`

#更新代码
git pull

#构建镜像
docker build -t foreveross/indexy-crawler-engine .

#删除容器
docker rm -f indexy-crawler-engine &> /dev/null

docker run -d --restart=on-failure:5 --privileged --net=host \
    -w /home \
    -v $PWD/logs/:/home/logs/ \
    -v $PWD/node_modules/:/home/node_modules/ \
    --name indexy-crawler-engine foreveross/indexy-crawler-engine /bin/sh pm2-run.sh

