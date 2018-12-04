# indexy-crawler-pdf

基于任务管理的爬虫引擎，本项目以`“学术论文”`领域作为实践案例。

## 功能模块

## 系统架构

## 技术选型

## 数据结构

## 系统截图

## 快速开始

- 下载源码

```
$ git clone https://gitee.com/ai-pager/indexy-crawler-pdf.git
$ cd ${your_project}
```

- 启动selenium-firefox(火狐浏览器)

```
$ ./startup-selenium-standalone-firefox.sh
```

- 修改startup-code.sh

```
$ vi startup-code.sh

#FIREFOX_REMOUTE_SERVER为selenium-firefox启动的ip,必须是局域网ip
FIREFOX_REMOUTE_SERVER=http://192.168.0.4:4444/wd/hub
```
- 启动pdf爬虫

```
$ ./startup-code.sh
```

ps: 可以启动多个pdf爬虫，共用一个selenium-firefox
## TODO

## 参考
