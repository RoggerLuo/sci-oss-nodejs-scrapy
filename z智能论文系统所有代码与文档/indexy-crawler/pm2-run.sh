#!/bin/sh

#安装依赖
npm install --registry=https://registry.npm.taobao.org --production

# docker官方镜像
pm2-docker --env production pm2.json --only indexy-crawler-engine

