#!/bin/bash


cd `dirname $0`

rm -rf dist dist.zip
npm run build # restack-mobile build

rm -rf ../pager-crawler/app/public/*

cp favicon.png ./dist
cp -R -f ./dist/. ../pager-crawler/app/public
