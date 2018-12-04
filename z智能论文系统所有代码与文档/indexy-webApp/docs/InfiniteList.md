### 关于listview
-[react-virtualized](https://github.com/bvaughn/react-virtualized) 
在项目中，所有的无限拖拉的列表，我使用了react-virtualized自己封装了一个组件，没有直接使用antd-mobile的listview组件是因为，使用过后，明显感觉拖拉不顺畅，在安卓机上尤其明显。
封装后的组件命名为`<InfinteList/> ` 位于`../src/js/components/InfiniteList.jsx `
在使用时，需要提供一些参数：

| 参数 | 说明 | 类型 | 是否必须 | 默认值 |
| --- | --- | --- | --- | :-: |
| dataSource | 列表数据源 | array | true | - |
| loading | 在获取数据时候的loading | boolean | false | false |
| ref | 关联列表 | string | false | '' |
| height  | 列表容器的高度 | number | true | - |
| noData | 列表没有数据时显示的内容 | function | false | null |
| rowHeight | 列表每一行的高度 | number | true | - |
| renderRow | 列表每一行的渲染 | function({key,style,index,parent}) | true | - |

```
<InfinteList
  loading: bool // 列表在获取数据时候的loading
  dataSource: arr // 列表的数据
  renderRow: function // 列表每一行的渲染
  loadMore: function // 获取更多数据时执行的function
  height: num // 列表容器的高度
  rowHeight: num // 列表每一行的高度
  noData: function // 当没有数据的时候 页面显示的内容
  ref: string // 绑定listview
/>
```
若只是渲染一个每行高度一致的列表，你只需要填写必填的因素，即可，这样的情况，在项目页面中，关注-添加期刊，关注-添加作者，都这样引用了组件，代码目录为：`../src/js/modules/discovery/add/Periodicals.jsx `和 `../src/js/modules/discovery/add/Author.jsx`

若像关注-作者、关注-定制页面的列表，列表的每一行都不是一样的高度的话，则需要加上[CellMeasurer](https://github.com/bvaughn/react-virtualized/blob/master/docs/CellMeasurer.md) 组件
你可以在`../src/js/modules/discovery/Custom.jsx`和`../src/js/modules/discovery/Authors.jsx`查看相应的代码
