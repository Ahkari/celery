# celery

专注于快速开发电商移动网站活动页的SDK库。


# 开发说明

<br/>

# info 说明

主要使用场景是电商网站移动端的活动页。

<br/>

嵌入了该sdk的页面将拥有如下功能：

1. 对默认的ehsy:// 协议解析并处理

2. html模板引擎与简单绑定

3. weixin sdk包装

4. cookie的预存与操作

5. 异步的网页统计代码加载

<br/>
<br/>
<br/>

# usage 使用

下面提供一种较为方便的使用方式：

<br/>

在页面中引用

```html
<script src="ehsy_sdk.js"></script>
```

js中配置完直接注入，类似angular的使用方式。

当然你可以省去配置这一步。

```JavaScript
ehsySdk.init({
    message : {
        //配置
    }
    ...
},[ 'message' , 'template' , 'weixin' , 'cookie' , 'analytics' ], function( message , template , weixin , cookie , analytics ){

    //直接获取了各个模块的引用
    //当然。这些模块也可以通过ehsySdk[ module ]这样来全局获取

})
```

<br/>
<br/>
<br/>

# module 模块说明

<br/>

# **ehsySdk**

## property

* message

* template

* weixin

* cookie

* analytics


## method

* `ehsySdk.config( options [, meta ])`

配置指定的一个或多个属性。

```javascript
ehsySdk.config({
    cookie : {
        token : 'etoken'
    }
})
```
等同于
```javascript
ehsySdk.config( 'cookie' , {
    token : 'etoken'
})
```

<br/>
<br/>
<br/>
<br/>
<br/>

# **message**

该模块是电商活动页的核心。

<br/>

期望通过`URLScheme`的形式来让内嵌活动页的宿主对象响应协议。

<br/>

正确初始化的`message`模块能让活动页适配多种环境。

<br/>

**URLScheme一览**  

——完整的文档参见这个：http://gitlab.ehsy.com/ehsy/app-ios/wikis/app-url%E8%B7%B3%E8%BD%AC%E8%A7%84%E5%88%99%E6%96%87%E6%A1%A3

```javascript
                case 'user/register' :
                //跳转到快速注册页
                case 'user/login' :
                //跳转到用户登录页
                case 'user/identify' :
                //跳转到用户认证页面
                case 'cart/open' :
                //打开购物车页面
                case 'cart/add' :
                //加入进购物车
                // ehsy://cart/add?pid=MVM054
                case 'my/notice' :
                //进入消息中心页面
                case 'my/account' :
                //进入账户管理
                case 'my/address' :
                //打开收货地址页面
                case 'my/invoice' :
                //打开发票抬头
                case 'my/favorite' :
                //我的收藏页面（实际跳转app页面与“我的足迹”同）
                case 'my/history' :
                //我的足迹（实际跳转app页面与“我的收藏页面”同）
                case 'my/coupon' :
                //优惠券页面
                case 'home' :
                case '' :
                //首页
                case 'my/order' :
                //订单
                //my/order?type=1
                case 'product/channel' :
                //跳转至商品频道（一级分类）页
                //product/channel?cid=8&name=工具
                case 'product/brand' :
                //跳转到商品品牌页              
                case 'product/list' :
                //跳转到商品列表页                
                case 'product/detail' :
```

<br/>

**tips**

1. 引用说明：

    不同的环境引用活动页html需要有一定制约。

    当活动页内嵌于M站之中的时候，需要指定`query`参数`from`为`m`，

    例如：

    `http://m.ehsy.com/activity/20161207?from=m`

    同理，活动页内嵌于APP之中的时候，`from`为`app`

    当活动页单独存在的时候，不需要指定`from`参数。

    （当活动页单独存在，且内嵌于`微信`之中，需要指定`from`为`wechat`，这个以后给微信的某些特有功能预留。）

2. 强制开启/关闭：

    `message`内部是通过`sender`消息发送者 和 `receiver`消息接收者 两者共同作用来实现的。

    通过`query`参数`form`，模块已经对`sender`和`receiver`功能正确开闭。

    如果需要强制开闭`sender`或`receiver`。可以通过`ehsySdk`进行配置。

    ```JavaScript
    ehsySdk.config( 'message' , {
        sender : true ,    //消息发送    开启
        receiver : false      //消息接受    关闭
    })
    ```

3. 自定义处理事件

    `message`的`receiver`对于的`URLScheme`有着自己默认的处理方法。

    在需要自定义处理这些事件的时候，可以为他们提供处理函数。（这时候默认的处理方法就不会被执行）

    ```javascript
    ehsySdk.config( 'message'  , {
        customerAction :{
            'cart/add' : function(){
                //add cart
            },
            'user/login' : function(){
                //login
            }
        }
    })
    ```

<br/>
<br/>
<br/>
<br/>
<br/>

# **template**

该模块实现了一个简单的模板引擎。方便开发者快速构建页面。

<br/>

支持` “Mustache”` 语法（双大括号）的文本插值式使用。

<br/>

也支持`vue`式 `[libs]-bind:[attrName]` 式语法。

支持如：`title`，`src`，`class`，`src`这些常用属性的绑定。

<br/>

为了让开发者快速理解本模板引擎的用法，我们提供如下的实例。

1. 初始化用于渲染的数据

    ```javascript
    var data = {
        productName : '枕头',
        productPrice : '50.00'
    } ;
    ```

2. 编写html模板

    ```html
    <div class="test-template">
        <h3>{{productName}}</h3>
        <span e-bind="productPrice"></span>
    </div>
    ```

3. 绑定

    ```JavaScript
    var element = document.getElementsByClassName( 'test-template' )[0] ;
    var dataBind = new ehsySdk.template( element , data ) ; 
    ```

    或用String式直接query，以上等同于下面

    ```javascript
    var dataBind = new ehsySdk.template( '.test-template' , data ) ;
    ```

或对Array数组应用绑定：

1. 初始化数据

    ```javascript
    var list = [{
        name : 'hello' ,
    },{
        name : 'world'
    }]
    ```

2. 编写html模板

    ```html
    <div class="list-template">
        <span>{{name}}</span>
    </div>
    ``` 

3. 绑定。（为`Array`的数据会自动应用循环模式）

    ```javascript
    var elementList = document.getElementsByClassName( 'list-tempalte' )[0] ;
    var dataBindList = new ehsySdk.template( elementList, list ) ;
    ```

在数据绑定成功之后，更改view可以通过`refresh`方法。

1. 没有改变原始数据的引用，可以直接调用模板实例的`refresh`方法

    ```javascript
    //接第一个例子
    data.productName = '这是更改的数据' ;
    dataBind.refresh() ;
    ```

2. 若希望使用全新数据，需要给`refresh`传递新的`data`

    ```javascript
    var newData = {
        productName : '全新产品' ,
        productPrice : '10000.0'
    }
    dataBind.refresh( newData ) ;
    ```

<br/>
<br/>
<br/>
<br/>
<br/>

# **weixin**

该模块旨在让开发者用包装后的API来直接操作微信功能, 

而无需关心微信初始化的时机以及所处环境。

<br/>

暴露的API和官网文档基本一致，有据可循。

<br/>

官方文档 ：https://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html

## method

* `onMenuShareTimeline` 分享到微信朋友圈

```javascript
weixin.onMenuShareTimeline({
    title: '', // 分享标题
    link: '', // 分享链接
    imgUrl: '', // 分享图标
    success: function () { 
        // 用户确认分享后执行的回调函数
    },
    cancel: function () { 
        // 用户取消分享后执行的回调函数
    }
});
```

* `onMenuShareAppMessage` 分享给微信朋友

```JavaScript
weixin.onMenuShareAppMessage({
    title: '', // 分享标题
    desc: '', // 分享描述
    link: '', // 分享链接
    imgUrl: '', // 分享图标
    type: '', // 分享类型,music、video或link，不填默认为link
    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    success: function () { 
        // 用户确认分享后执行的回调函数
    },
    cancel: function () { 
        // 用户取消分享后执行的回调函数
    }
});
```

* `onMenuShareQQ` 分享到QQ

```javascript
weixin.onMenuShareQQ({
    title: '', // 分享标题
    desc: '', // 分享描述
    link: '', // 分享链接
    imgUrl: '', // 分享图标
    success: function () { 
       // 用户确认分享后执行的回调函数
    },
    cancel: function () { 
       // 用户取消分享后执行的回调函数
    }
});
```

* `onMenuShareWeibo` 分享到腾讯微博

```javascript
weixin.onMenuShareWeibo({
    title: '', // 分享标题
    desc: '', // 分享描述
    link: '', // 分享链接
    imgUrl: '', // 分享图标
    success: function () { 
       // 用户确认分享后执行的回调函数
    },
    cancel: function () { 
        // 用户取消分享后执行的回调函数
    }
});
```

* `onMenuShareQZone` 分享到QQ空间

```javascript
weixin.onMenuShareQZone({
    title: '', // 分享标题
    desc: '', // 分享描述
    link: '', // 分享链接
    imgUrl: '', // 分享图标
    success: function () { 
       // 用户确认分享后执行的回调函数
    },
    cancel: function () { 
        // 用户取消分享后执行的回调函数
    }
});
```

<br/>
<br/>
<br/>
<br/>
<br/>

# **cookie**

该模块旨在让开发者便捷操作cookie。

<br/>

你可以通过更改配置来存储和预设不一样的值，也可用和jquery.cookie类似的API来操作他们。

## property

* `cookie[ tokenName ]`

```javascript
cookie.token ;    //1105C57357305A52B2CC4D7159FE9A4DC46B654D2D337C23F3905B951C6A6D88
cookie[ 'openid' ] ;    //o_Rgms4nmTdZNRFhDo_V320ABSpc
```
## method

* `cookie.get( tokenName )  `
* `cookie.config( tokenName , value , options ) `

获取cookie，设置cookie

```javascript
cookie.get( 'etoken' ) ; //1105C57357305A52B2CC4D7159FE9A4DC46B654D2D337C23F3905B951C6A6D88
cookie.config( 'yourName' , 'ahkari' ,   {
    path : '/' ,
    domain : '.ehsy.com'
} )
```

* `cookie.removeCookie( cookieName [, options ]  )`

* `options`
  * domain ----  *String*
  * path ---- *String*
  * expires ---- *Number*
  * secure ---- *Boolean*


<br/>
<br/>
<br/>
<br/>
<br/>

# **analytics**

本模块提供网页统计代码的配置。

<br/>

因为模块默认关闭着的，需要通过配置的方式来开启。

```JavaScript
ehsySdk.config({
    'analytics' : [
        // '友盟统计' , //不可用，该统计不支持异步加载
        '百度统计' ,
        '百度推送' ,
        '谷歌统计'
    ] 
})
```

或对`analytics`对象`init()`

```JavaScript
analytics.init() ; //不带参数默认初始全部
```

备注：

1. 友盟统计不支持异步加载，请在页面中直接引入如下js文件：

    ```html
    <!--友盟统计-->
    <script src="//s4.cnzz.com/z_stat.php?id=1259301846&web_id=1259301846" language="JavaScript"></script>
    ```

2. 谷歌统计本sdk只提供了页面pv的统计，如果需要电子商务等统计，请查看以下文档（需翻墙）：

    `https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce`   


<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>


