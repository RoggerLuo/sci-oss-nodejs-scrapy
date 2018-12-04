# 智能论文系统领域管理API文档


> 领域管理**Api**设计文档。



## [General](#)

- Web Context：`crawler`
- Version：`v1`
- Resources: `e.g. fields`
- Base Url: `/{context}/api/{version}/{Resources}`   e.g. /crawler/api/v1/fields

## [获取一级领域列表](#)

- HTTP Request

		GET http://example.com/crawler/api/v1/fields/firstLevel		
- URL Parameters

	Parameter  | defaltValue|Description
	---------- | --------|-----|

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
	"success": true,
	"payload": [
		{
			"id": 1,
			"name": "医学",
			"parentId": null,
			"created_at": "2017-12-14T08:33:49.000Z",
			"updated_at": "2017-12-14T08:50:37.000Z"
		},
		{
			"id": 8,
			"name": "计算机",
			"parentId": null,
			"created_at": "2017-12-14T08:47:09.000Z",
			"updated_at": "2017-12-14T08:47:09.000Z"
		},
		{
			"id": 9,
			"name": "生物工程",
			"parentId": null,
			"created_at": "2017-12-14T08:47:47.000Z",
			"updated_at": "2017-12-14T08:47:47.000Z"
		}
	]
}
	```

	- 500：`HTTP/1.1 500 Internal Server Error`

	```json
	{
	    "message":err msg...,
	    "success": false
	}
	```

	## [根据父级获取直属子级领域](#)

	>无树形结构,只获取直属子级

- HTTP Request

		GET http://example.com/crawler/api/v1/fields/:id/childrens		
- URL Parameters

	Parameter  | defaltValue|Description
	---------- | --------|-----|
	id||领域id

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
	"success": true,
	"payload": [
		{
			"id": 10,
			"name": "基础医学",
			"parentId": 1,
			"created_at": "2017-12-14T08:48:12.000Z",
			"updated_at": "2017-12-14T08:48:12.000Z"
		}
	]
}
	```

	- 500：`HTTP/1.1 500 Internal Server Error`

	```json
	{
	    "message":err msg...,
	    "success": false
	}
	```

	## [根据父级获取树形子级领域](#)

	>有树形结构

- HTTP Request

		GET http://example.com/crawler/api/v1/fields/:id/childrenTree		
- URL Parameters

	Parameter  | defaltValue|Description
	---------- | --------|-----|
	id||领域id

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
	"success": true,
	"payload": [
		{
			"id": 10,
			"name": "基础医学",
			"parentId": 1,
			"childrens":[
			  {
			     "id": 11,
			     "name": "医学病理学",
			     "parentId": 10,
			     "childrens":null,
			     "created_at": "2017-12-14T08:48:12.000Z",
			     "updated_at": "2017-12-14T08:48:12.000Z"
			  }
			],
			"created_at": "2017-12-14T08:48:12.000Z",
			"updated_at": "2017-12-14T08:48:12.000Z"
		}
	]
}
	```

	- 500：`HTTP/1.1 500 Internal Server Error`

	```json
	{
	    "message":err msg...,
	    "success": false
	}
	```

## [根据id获取单个领域](#)

- HTTP Request

		GET http://example.com/crawler/api/v1/fields/:id

- URL Parameters

	Parameter  | defaltValue|Description
	---------- | --------|-----|
	id||领域id

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
	"success": true,
	"payload":{
			"id": 10,
			"name": "基础医学",
			"parentId": 1,
			"created_at": "2017-12-14T08:48:12.000Z",
			"updated_at": "2017-12-14T08:48:12.000Z"
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

	## [新增领域](#)

- HTTP Request

		POST http://example.com/crawler/api/v1/fields

- Query Parameters

	Parameter  | defaltValue|Description
	---------- | --------|-----|

- URL Parameters

	Parameter  | defaltValue|Description
	---------- | --------|-----|

- HTTP Headers

	Header  | Default | Description
	----- | -----|--------|-----
	Content-Type|text/html; charset=utf-8|application/json; charset=utf-8

- HTTP Body

	```js
	//filed数据对象,可选填写，以下是全字段
{
	"name":"医学病毒学",
	"parentId":10
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
	"payload": [
		1
	]
}
	```

	- 500：`HTTP/1.1 500 Internal Server Error`

	```json
	{
	    "message":err msg...,
	    "success": false
	}
	```


	## [更新领域](#)

- HTTP Request

		PUT http://example.com/crawler/api/v1/fields/:id

- Query Parameters

	Parameter  | defaltValue|Description
	---------- | --------|-----|

- URL Parameters

	Parameter  | defaltValue|Description
	---------- | --------|-----|
	id||领域id

- HTTP Headers

	Header  | Default | Description
	----- | -----|--------|
	Content-Type|text/html; charset=utf-8|application/json; charset=utf-8

- HTTP Body

	```json
	//filed数据对象,可选填写，以下是全字段
{
	"name":"医学",
	"parentId":null
}
```


- HTTP Status
	- 200：`HTTP/1.1 200 Success`
	- 500：`HTTP/1.1 500 Internal Server Error`

- HTTP Response

	- 200：`HTTP/1.1 200 Success`

	```json
	{
	    "payload": 1,//修改成功
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


	## [根据id删除领域](#)

- HTTP Request

		DELETE http://example.com/crawler/api/v1/fields/:id

- URL Parameters

	Parameter  | defaltValue|Description
	---------- | --------|-----|
	id||领域id,可多个:1,2

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
