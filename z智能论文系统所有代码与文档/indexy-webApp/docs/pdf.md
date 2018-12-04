###关于PDF.jsx
-[react-pdf](https://www.npmjs.com/package/react-pdf)
在项目中为实现pdf在线预览，使用react-pdf封装了一个组件，位于`../src/js/components/Pdf.jsx`

使用时需要提供的参数说明：

|参数|说明|类型|是否必须|默认值|
|---|---|---|:---:|:---:|
|file|需要显示的PDF文件|URL、File、Parameter object|true|-|


在组件中引用react-pdf中的两个组件```<Document /``````<Page />```

并把```<Page />```组件放在里面```<Document />```来渲染页面

 ```import { Document, Page  } from 'react-pdf'```
 
 当使用这种引入方式的时候，使用webpack打包之后会出现缺失work.js文件的情况。如果使用webpack打包
 建议使用
 ```import { Document, Page  } from 'react-pdf/dist/entry.webpack'```
 这种方式引入，则不会出现文件缺失的问题。

其他在组件中配置的参数说明:

- Document

|参数|说明|类型|是否必须|默认值|
|---|---|---|:---:|:---:|
|loading|在加载PDF时显示的内容|String、React element、Function|false|"Loading PDF…"|
|error|在组件出现错误时显示的内容|String、React element、Function|false|"Failed to load PDF file."|
|noData|在组件没有数据file时显示的内容|String、React element、Function|false|No PDF file specified.|
|onLoadError|加载PDF出错调用的函数|function|false|无|
|onLoadSuccess|加载PDF成功调用的函数|function|false|无|

- Page

|参数|说明|类型|是否必须|默认值|
|---|---|---|:---:|:---:|
|pageNumber|当前渲染的PDF页数|number|true|-|
|key|同时渲染多页PDF时用作react组件的key|number|true|-|
|width|定义当前页面的宽度，如果未定义，页面将以PDF中定义的宽度呈现|number|false|无|


```<Page />```用来渲染PDF，在使用时，若file的文件源为异步获取，则需要对file是否已经获取到并已被```<Document/>```加载完做判断，当file已经
获取到之后才渲染```<Page />```，若不做判断的话，可能会导致file还未获取到或者未加载完毕的时候，页面却显示了error的内容。

例如：

```
<Document
    file={url}
    loading={<ActivityIndicator size="large" toast text="加载中..."/>}
    error={<Noting emptyText="PDF加载出错" />}
    noData={<Noting />}
    onLoadError={(error)=> this.nothing(error.messsage)}
    onLoadSuccess={this.onDocumentLoad}
  >
  {
              this.state.data.length && this.state.data.map((item,index)=>{
                return <Page pageNumber={item} key={index} width={this.props.wrapperDivSize}  />
              })
            }
    </Document>
```
```
onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages , button: true });
    let Data = []
    for(var i = 1;i <= numPages;i++){
      Data.push(i)
    }
    this.setState({ data: Data })
  }
```

```onDocumentLoad()```的参数```numPages```为PDF文件的总页数