#!/bin/bash

cd `dirname $0`

docker rm -f indexy-selenium-firefox

docker run -d -p 4444:4444 \
   --shm-size 1g \
   --name indexy-selenium-firefox selenium/standalone-firefox:3.11.0-bismuth