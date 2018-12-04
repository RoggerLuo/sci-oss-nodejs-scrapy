# 文章管理设计文档

> 文章管理**Api**设计文档。



## [General](#)

- Web Context：`crawler`
- Version：`v1`
- Resources: `e.g. articles`
- Base Url: `/{context}/api/{version}/{Resources}`   e.g. /crawler/api/v1/articles

## [分页获取文章列表](#)

- HTTP Request

		GET http://example.com/crawler/api/v1/articles		
- URL Parameters

	Parameter  | defaltValue|Description
	---------- | --------|-----|

- Query Parameters

Parameter  | defaltValue|Description
---------- | --------|-----|
page|0|页码
size|10|每页大小
title||文章名称
article||作者
tags||医学,多基因(多个时逗号分割)
order|id,desc|排序

- HTTP Headers

	Header  | Default | Description
	----- | -----|--------|-----
	Content-Type|text/html; charset=utf-8|application/json; charset=utf-8

- HTTP Status
	- 200：`HTTP/1.1 200 Success`
	- 500：`HTTP/1.1 500 Internal Server Error`

- HTTP Response

	- 200：`HTTP/1.1 200 Success`

	```json
	{
	"success": true,
	"payload": {
		"count": 2,
		"rows": [
		{//文章对象}
					]
	}
}
	```

	- 500：`HTTP/1.1 500 Internal Server Error`

	```json
	{
	    "message":err msg...,
	    "success": false
	}
	```

## [新增文章](#)

	>录入文章

- HTTP Request

		POST http://example.com/crawler/api/v1/articles

- Query Parameters

	Parameter  | defaltValue|Description
	---------- | --------|-----|

- URL Parameters

	Parameter  | defaltValue|Description
	---------- | --------|-----|

- HTTP Headers

	Header  | Default | Description
	----- | -----|--------|
	Content-Type|text/html; charset=utf-8|application/json; charset=utf-8

- HTTP Body

	```js
	//article数据对象,可选填写，以下是全字段
  {
			"title": "测试发布文章",
			"summary": "测试发布文章",
			"author": "刘媛媛,李海峰",//作者名,多个用","隔开
			"keywords": "Educação;odontologia;Motivação",//多个用;隔开
			"tags": "护理学",//领域,多个用,隔开
			"journal": "Bioscience Journal",//期刊名
			"publishTime": "2017-11-13 10:00:00",
  }
	```

- HTTP Status
    - 200：`HTTP/1.1 200 Success`
    - 500：`HTTP/1.1 500 Internal Server Error`

- HTTP Response

	- 200：`HTTP/1.1 200 Success`

	```json
    {
  	"success": true,
  	"payload": {
  		"watch": 0,
  		"id": 2582650,
  		"title": "测试发布文章1",
  		"summary": "测试发布文章1",
  		"author": "刘媛媛,李海峰",
  		"keywords": "Educação;odontologia;Motivação",
  		"tags": "护理学",
  		"journal": "Bioscience Journal",
  		"publishTime": "2017-11-13T10:00:00.000Z",
  		"taskResult_id": 0,
  		"updated_at": "2017-12-20T15:13:06.986Z",
  		"created_at": "2017-12-20T15:13:06.986Z"
  	}
  }
	```

	- 500：`HTTP/1.1 500 Internal Server Error`

	```json
	{
	    "message":err msg...,
	    "success": false
	}
	```



## [根据id获取单个文章](#)

- HTTP Request

		GET http://example.com/crawler/api/v1/articles/:id

- URL Parameters

	Parameter  | defaltValue|Description
	---------- | --------|-----|
	id||文章id

- Query Parameters

Parameter  | defaltValue|Description
---------- | --------|-----|

- HTTP Headers

	Header  | Default | Description
	----- | -----|--------|-----
	Content-Type|text/html; charset=utf-8|application/json; charset=utf-8

- HTTP Status
	- 200：`HTTP/1.1 200 Success`
	- 500：`HTTP/1.1 500 Internal Server Error`

- HTTP Response

	- 200：`HTTP/1.1 200 Success`

	```json
	{
      "payload": {
        //文章对象
      },
      "success": true
    }
	```

	- 500：`HTTP/1.1 500 Internal Server Error`

	```json
	{
	    "message":err msg...,
	    "success": false
	}
	```


	## [根据id删除文章](#)

- HTTP Request

		DELETE http://example.com/crawler/api/v1/articles/:id

- URL Parameters

	Parameter  | defaltValue|Description
	---------- | --------|-----|
	id||文章id

- Query Parameters

Parameter  | defaltValue|Description
---------- | --------|-----|

- HTTP Headers

	Header  | Default | Description
	----- | -----|--------|-----
	Content-Type|text/html; charset=utf-8|application/json; charset=utf-8

- HTTP Status
	- 200：`HTTP/1.1 200 Success`
	- 500：`HTTP/1.1 500 Internal Server Error`

- HTTP Response

	- 200：`HTTP/1.1 200 Success`

	```json
	{
      "payload":1,
      "success": true
    }
	```

	- 500：`HTTP/1.1 500 Internal Server Error`

	```json
	{
	    "message":err msg...,
	    "success": false
	}
	```
