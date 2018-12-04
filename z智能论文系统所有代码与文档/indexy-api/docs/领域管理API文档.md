# 智能论文系统领域管理API文档


> 领域管理**Api**设计文档。



## [General](#)

- Web Context：`indexy_api`
- Version：`v1`
- Resources: `e.g. fields`
- Base Url: `/{context}/api/{version}/{Resources}`   e.g. /indexy_api/api/v1/fields

## [获取一级领域列表](#)

- HTTP Request

		GET http://example.com/indexy_api/api/v1/fields/firstLevel		
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

	## [根据父级获取子级领域](#)

	>无树形结构,只获取直属子级

- HTTP Request

		GET http://example.com/indexy_api/api/v1/fields/:id/childrens		
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

		GET http://example.com/indexy_api/api/v1/fields/:id/childrenTree		
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

		GET http://example.com/indexy_api/api/v1/fields/:id

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

		POST http://example.com/indexy_api/api/v1/fields

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

		PUT http://example.com/indexy_api/api/v1/fields/:id

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

		DELETE http://example.com/indexy_api/api/v1/fields/:id

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


	## [用户关注领域](#)

- HTTP Request

		POST /api/v1/users/:userId/follow/fields/:fieldId

- URL Parameters

	Parameter  | defaltValue|Description
	---------- | --------|-----|
	userId||用户id
	fieldId||领域id,eg:1,2,3

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
	"payload": {
		"id": 3,
		"userId": "15",
		"fieldId": "1",
		"isFollow": true,
		"updated_at": "2017-12-07T08:43:10.315Z",
		"created_at": "2017-12-07T08:43:10.315Z"
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


## [用户屏蔽领域](#)

- HTTP Request

		POST /api/v1/users/:userId/unfollow/fields/:fieldId

- URL Parameters

	Parameter  | defaltValue|Description
	---------- | --------|-----|
	userId||用户id
	fieldId||领域id

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
	"payload": {
		"id": 3,
		"userId": "15",
		"fieldId": "1",
		"isFollow": false,
		"updated_at": "2017-12-07T08:43:10.315Z",
		"created_at": "2017-12-07T08:43:10.315Z"
	}
	```

	- 500：`HTTP/1.1 500 Internal Server Error`

	```json
	{
	    "message":err msg...,
	    "success": false
	}
	```



## [分页获取用户关注的所有领域最新的文章](#)

首页---》领域列表

- HTTP Request

`GET http://example.com/indexy_api/api/v1/users/:userId/fields/articles`

- URL Parameters


	Parameter  | defaltValue| require | Description
---------- | --------|-----|--------
	userId||yes|用户id


- Query Parameters

Parameter  | defaltValue|Description
---------- | --------|-----|
page|0|页码
size|10|每页大小
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
    	"count": 1,
    	"rows": [
    		{
    			"id": 1,
    			"fieldId": 1,
    			"articleId": 4,
    			"article":{
    			    "id":4,
        			 "title": "ICP-MS法测定地域标志产品四川涪城麦冬中的重金属含量",
        			 "summary": "关于多基因遗传学的研究已经持续了多年....",//摘要
        			"keywords": "ICP-MS；涪城麦冬；重金属,",
        			"publishTime": "2017-01-01T00:00:00.000Z",
    			},
    			"created_at": "2017-12-07T09:05:35.000Z",
    			"updated_at": "2017-12-07T09:05:37.000Z"
    		}
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


	## [查看用户是否有关注领域](#)

	- HTTP Request

			 GET  /api/v1/users/:userId/hasFollowField

	- URL Parameters

		Parameter  | defaltValue|Description
		---------- | --------|-----|
		id||用户id

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
		"payload":"1" //"1":已关注了领域,"0":还没关注任何领域
	}
		```

		- 500：`HTTP/1.1 500 Internal Server Error`

		```json
		{
		    "message":err msg...,
		    "success": false
		}
		```

		## [获取用户关注的领域列表](#)

		- HTTP Request

				 GET  /api/v1/users/:userId/fields

		- URL Parameters

			Parameter  | defaltValue|Description
			---------- | --------|-----|
			userId||用户id

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
						"userId": 18,
						"name": "医学"
					},
					{
						"id": 8,
						"userId": 18,
						"name": "计算机"
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
