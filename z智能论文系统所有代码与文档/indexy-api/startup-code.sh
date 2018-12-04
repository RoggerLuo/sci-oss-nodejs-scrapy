#!/bin/bash

cd `dirname $0`
#更新代码
git pull

#下载依赖
#docker run --rm -v "$PWD":/root -w /root node npm install -g python && npm install

#构建镜像
docker build -t foreveross/indexy-api .

#删除容器
docker rm -f indexy-api &> /dev/null

docker run -d --restart=on-failure:5 \
    -w /home \
    -p 3004:3004 \
    -v $PWD/logs/:/home/logs/  \
    -v $PWD/run/:/home/run/  \
    -v $PWD/node_modules/:/home/node_modules/  \
    -v /home/indexy-pdf:/home/app/public/articles \
    --name indexy-api foreveross/indexy-api

