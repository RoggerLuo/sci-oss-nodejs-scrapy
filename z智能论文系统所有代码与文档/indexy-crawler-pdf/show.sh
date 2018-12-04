#!/usr/bin/env bash
set -e


pwd=`dirname $0`


docker exec -ti indexy-crawler-pdf pm2 list

# docker exec -ti indexy-crawler-pdf pm2 monit
