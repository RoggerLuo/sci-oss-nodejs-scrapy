## 关于其他组件
---------------

### CheckLogin.jsx

在```<routes/>```中通过Token是否存在判断用户是否登录从而控制路由跳转。

位于`../src/js/components/CheckLogin.jsx`

```
<Route path="/" >
      <Switch>
        <Route path={path.login.url} component={Login} />
        <Route path={path.register.url} component={Register}/>
        <Route path={path.forgetPassword.url} component={ForgetPassword} />
        <CheckLogin>
          <Route exact path="/index.html" component={HomePage} />
          ...
          <Route exact path={`${path.read.url}/:id`} component={Read} />
        </CheckLogin>
      </Switch>
  </Route>
```
登录前的路由写在```<CheckLogin/>```外面，登录后的路由写在```<CheckLogin/>```里面；

### ConditionExchange.jsx

在定制页面用来将条件字段转换成中文后输出用于页面展示

位于`../src/js/components/ConditionExchange.jsx`

如：
```<div className="name">篇名：{obj.titleText}<span>({exchange(obj.titleOper)})</span></div>```

obj.titleOper为需要转换的条件字段

### ErrorToast.jsx

在model中用于展示报错信息

位于`../src/js/components/ErrorToast.jsx`

### Header.jsx

通过将antd-mobile的```<NavBar/>```组件进行封装，用于页面顶部的导航

位于`../src/js/components/Header.jsx`

组件接收的参数:

|参数|说明|类型|是否必须|默认值|
|---|---|---|:---:|:---:|
|headerOptions|配置信息|object|true|-|

- headerOptions

|参数|说明|类型|是否必须|默认值|
|---|---|---|:---:|:---:|
|icon|出现在最左边的图标占位符|ReactNode|false|-|
|onLeftClick|点击icon的回调|(e: Object): void|false|无|
|rightContent|导航右边内容|any|false|无|
|leftContent|导航左边内容|any|false|无|
|text|导航中间内容|any|false|无|

### Logo.jsx

用来返回一个显示首字母的头像

位于`../src/js/components/Logo.jsx`

组件接收的参数:

|参数|说明|类型|是否必须|默认值|
|---|---|---|:---:|:---:|
|name|需要进行处理的文字|string|true|-|
|width|头像的宽度|string(示例：45px)|true|-|
|height|头像的高度|string(示例：45px)|true|-|
|className|类名|string|false|无|

### More.jsx

用来控制一段文字的长度，并支持点击显示全部文字

位于`../src/js/components/More.jsx`

组件接收的参数:

|参数|说明|类型|是否必须|默认值|
|---|---|---|:---:|:---:|
|text|需要处理的文字|string|true|-|
|words|处理后的文字长度|number|true|-|
|disable|判断是否启用点击显示全部|boolean|false|无|

当disable=true时，屏蔽点击显示全部的功能

### Nothing.jsx

当页面无数据时的页面提示

位于`../src/js/components/More.jsx`

组件接收的参数：

|参数|说明|类型|是否必须|默认值|
|---|---|---|:---:|:---:|
|onClick|button的点击回调，若无此参数，则不渲染button|function|false|无|
|btnText|button的text|string|false|立即添加|
|emptyText|提示语|string|false|什么都没有哦~|

### ContentListItem.jsx

用于渲染列表中的列，由于本项目列表较多，所以将列表中每一列的渲染封装成该组件

位于`../src/js/components/content-list-item/ContentListItem.jsx`

组件接收的参数：

|参数|说明|类型|是否必须|默认值|
|---|---|---|:---:|:---:|
|type|用来区分不同的列表，渲染不一样的视图|string|true|-|
|item|数据源|object|true|-|
|rowID|循环渲染时需要传值，在组件中用来作为key|number|false|无|

### WithFooter.jsx

使用antd-mobile的[TabBar](https://mobile.ant.design/components/tab-bar-cn/) 封装的组件，
用于页面底部的导航栏，在```<CheckLogin/>```中使用

位于`../src/js/frame/WithFooter.jsx`

组件中定义了一个数组withoutFooter，由不需要显示底部导航栏的url组成