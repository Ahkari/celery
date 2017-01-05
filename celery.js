/**
 * ehsy_sdk 0.1.0
 * Mobile Library For EHSY web mobile development
 *
 * http://gitlab.ehsy.com/ehsy/m.ehsy.com/wikis/ehsy-sdk%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3
 *
 * Copyright 2016, Ahkari
 * http://m.ehsy.com/
 *
 * Licensed under MIT
 *
 * Released on: December 25, 2016
 */

;(function(){
    var config = {
        /*
        * sdk特征验证
        * */
        identity : {
            sdk : 'ehsy_ahkari' ,
            analyticsClassName : 'ehsy_analytics_element'
        },
        message : {
            sender : undefined ,
            receiver : undefined ,
            protocol : 'ehsy:' , // ehsy: | http:
            customerAction : {

            }
        },
        /*
        * 模板引擎配置
        * */
        template : {
            supportAttr : [ 'title' , 'href' , 'class' , 'src' ] , //绑定支持的元素属性
            mustache : /\{\{(\S|\s)*\}\}/ , //mustache 正则匹配规则,也可以自定义
        },
        /*
        * 微信配置
        * */
        weixin : {
            sdkUrl : '//res.wx.qq.com/open/js/jweixin-1.0.0.js' ,
        },
        /*
        * Cookie 配置 , 是cookie对象中的直接属性
        * */
        cookie : {
            openid : 'wx_open_id' ,
            token : 'mtoken'
        },
        /*
        * Analytics 配置 , 是analytics中需要加入页面中的统计源
        * */
        analytics :  [
            // '友盟统计' ,
            '百度统计' ,
            '百度推送' ,
            '谷歌统计'
        ]
        // user : {
        //     data : {
        //         'userInfo' : function(){
        //
        //         },
        //         'authInfo' : function(){
        //
        //         }
        //     } ,
        // },
    } ;

    /*
    * BOOTSTRAP
    * */
    if ( typeof ehsy_sdk !== 'undefined' && ( ehsy_sdk.constructor.constructorName === config.identity.sdk ) ){
        throw new Error( 'ehsy_sdk has been Initialization.' ) ;
        return ; //其实没必要,但是还是要说明这里已经跳出了。
    }
    /*
    * compatible
    * */
    ;(function(){
        /*
        * Array forEach
        * */
        if ( typeof Array.prototype.forEach !== 'function' ){
            function a(callbackfn){
                var T ;
                if ( arguments.length > 1 ){
                    T = arguments[1] ;
                }
                var self = this ;
                var length = this.length ;
                if ( typeof callbackfn !== 'function' ){
                    throw new TypeError( 'Array.prototype.forEach callback must be a function' ) ;
                }
                var i = -1 ;
                while ( ++i < length ){
                    if ( i in self ){
                        if ( typeof T === 'undefined' ){
                            callbackfn( self[i] , i ) ;
                        } else {
                            callbackfn.call( T , self[i] , i ) ;
                        }
                    }
                }
            }
            Array.prototype.forEach = a ;
        } ;
    })() ;
    /*
    * Global Utils
    * */
    /*
     * common function
     * */
    function _deepCopy(target,src){
        for ( var _o in src ) {
            if ( src.hasOwnProperty( _o ) ){
                //执行该属性的拷贝
                if ( typeof src[ _o ] === 'function' ){
                    //function
                    target[ _o ] = src[ _o ] ;
                } else if ( _isArray( src[ _o ] ) ){
                    //Array
                    target[ _o ] = [] ;
                    _deepArr(target[ _o ],src[ _o ]) ;
                } else if ( typeof src[ _o ] === 'object' ){
                    //Object
                    target[ _o ] = {} ;
                    _deepCopy( target[ _o ] , src[ _o ] ) ;
                } else {
                    //plain data
                    target[ _o ] = src[ _o ] ;
                }
            }
        }
    }
    function _deepArr(target,src){
        var len = src.length ;
        for ( var i = 0 ; i < len ; i++ ){
            if ( typeof src[ i ] === 'function' ){
                target[ i ] = src[ i ] ;
            } else if ( _isArray( src[ i ] )  ){
                target[ i ] = [] ;
                _deepArr( target[ i ] , src[ i ] ) ;
            } else if ( typeof src[ i ] === 'object' ){
                target[ i ] = {} ;
                _deepCopy( target[ i ] , src[ i ] ) ;
            } else {
                target[ i ] = src[ i ] ;
            }
        }
    }
    function _isArray( arr ){
        return Array.isArray ? Array.isArray(arr) : ( Object.prototype.toString.call(arr) == '[object Array]' ) ;
    }
    function _get(url,successFunc,errorFunc){
        var req = _createXMLHTTPRequest();
        if(req){
            req.open("GET", url , true);
            req.onreadystatechange = function(){
                if(req.readyState == 4){
                    if(req.status == 200){
                        successFunc && successFunc( JSON.parse( req.responseText ) ) ;
                    }else{
                        arguments[2] && arguments[2]( JSON.parse( req.responseText ) ) ;
                    }
                }
            }
            req.send(null);
        }
    }
    function _createXMLHTTPRequest() {
        var xmlHttpRequest;
        if (window.XMLHttpRequest) {
            xmlHttpRequest = new XMLHttpRequest();
            if (xmlHttpRequest.overrideMimeType) {
                xmlHttpRequest.overrideMimeType("text/xml");
            }
        } else if (window.ActiveXObject) {
            var activexName = [ "MSXML2.XMLHTTP", "Microsoft.XMLHTTP" ];
            for ( var i = 0; i < activexName.length; i++) {
                try {
                    xmlHttpRequest = new ActiveXObject(activexName[i]);
                    if(xmlHttpRequest){
                        break;
                    }
                } catch (e) {
                }
            }
        }
        return xmlHttpRequest;
    }
    function _isWeixin(){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }else{
            return false;
        }
    }
    function _query(el){
        if ( typeof  el === 'string' ){
            var selector =el ;
            el = document.querySelector( el ) ;
            if ( !el ){
                console.warn( 'cannot find element: ' + selector ) ;
            }
        }
        return el ;
    }
    function _before(el,target){
        //insert el before target
        target.parentNode.insertBefore( el , target ) ;
    }
    function _after(el,target) {
        //insert el after target
        if ( target.nextSibling ){
            _before( el , target.nextSibling ) ;
        } else {
            target.parentNode.appendChild( el ) ;
        }
    }
    function _prepend( el, target ){
        //insert el as first child in target
        if ( target.firstChild ){
            _before( el , target.firstChild ) ;
        } else {
            target.appendChild( el ) ;
        }
    }
    function _extractContent( el , asFragment ){
        var child ;
        var rawContent ;
        if ( el.hasChildNodes() ){
            _trimNode( el ) ;
            rawContent = asFragment
                ? document.createDocumentFragment()
                : document.createElement( 'div' ) ;
            while( child = el.firstChild ) {
                rawContent.appendChild( child ) ;
            }
        }
        return rawContent ;
    }
    function _remove( el ){
        el.parentNode.removeChild( el ) ;
    }
    function _replace( target , el ){
        //el replace target
        var parent = target.parentNode ;
        if ( parent ) {
            parent.replaceChild( el , target ) ;
        }
    }
    function _trimNode( node ){
        //trim content and space in node element begin and last
        var child ;
        while ( child = node.firstChild , _isTrimmable( child ) ){
            node.removeChild( child ) ;
        }
        while ( child = node.lastChild , _isTrimmable( child ) ){
            node.removeChild( child ) ;
        }
    }
    function _isTrimmable( node ){
        return node && (
            ( node.nodeType === 3 && !node.data.trim() ) ||
            node.nodeType === 8
        )
    }
    function _getAttr( node, _attr ){
        var val = node.getAttribute( _attr ) ;
        if ( val !== null ){
            node.removeAttribute( _attr ) ;
        }
        return val ;
    }
    function _getBindAttr( node, name ){
        var val = _getAttr( node , ':' + name ) ;
        if ( val === null ){
            val = _getAttr( node , 'e-bind:' + name ) ;
        }
        return val ;
    }
    function _hasBindAttr( node, name ){
        return node.hasAttribute( name ) ||
            node.hasAttribute( ':' + name ) ||
            node.hasAttribute( 'e-bind:' + name ) ;
    }
    function _isBrowser(){
        return ( typeof window !== 'undefined' &&
            Object.prototype.toString.call( window ) !== '[object object]'
        )
    }
    function _isIE9(){
        var ua = _isBrowser() && window.navigator.userAgent.toLowerCase() ;
        return ua && ua.indexOf( 'msie 9.0' ) > 0
    }
    function _setClass( el , cls ){
        if ( _isIE9 && !/svg$/.test( el.namespaceURI ) ){
            el.className = cls ;
        } else {
            el.setAttribute( 'class' , cls ) ;
        }
    }
    function _getClass( el ){
        return el.className ;
    }
    function _addClass( el , cls ){
        if ( el.classList ) {
            el.classList.add( cls ) ;
        } else {
            var cur = ' ' + _getClass( el ) + ' ' ;
            if ( cur.indexOf( ' ' + cls + ' ' ) < 0 ){
                _setClass( el , ( cur + cls ).trim() ) ;
            }
        }
    }
    function _removeClass(el , cls){
        if ( el.classList ){
            el.classList.remove( cls ) ;
        } else {
            var cur = ' ' + _getClass( el ) + ' ' ;
            var tar = ' ' + cls + ' ' ;
            while ( cur.indexOf( tar ) >= 0 ){
                cur = cur.replace( tar , ' ' ) ;
            }
            _setClass( el , cur.trim() ) ;
        }
        if ( !el.className ){
            el.removeAttribute( 'class' ) ;
        }
    }
    function _html_encode(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&gt;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        s = s.replace(/\n/g, "<br>");
        return s;
    }
    function _html_decode(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&gt;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        s = s.replace(/<br>/g, "\n");
        return s;
    }
    function _objectStringFind( target , string ){
        var strArr = string.split( '.' ) ;
        var ret = target ;
        try {
            for( var i = 0 ; i < strArr.length ; i++ ){
                ret = ret[ strArr[ i ] ] ;
            }
        } catch (e){
            throw new Error( 'cant find ' + sting + ' in Binding Data' ) ;
        }
        return ret ;
    }
    function _isInEhsyApp(){
        return location.href.indexOf( 'from=app' ) >= 0 ;
    }
    function _isInEhsyM(){
        return location.href.indexOf( 'from=m' ) >= 0 ;
    }
    function _addHandler(target, eventType, handler){
        if(target.addEventListener){//主流浏览器
            addHandler = function(target, eventType, handler){
                target.addEventListener(eventType, handler, false);
            };
        }else{//IE
            addHandler = function(target, eventType, handler){
                target.attachEvent("on"+eventType, handler);
            };
        }
        //执行新的函数
        addHandler(target, eventType, handler);
    }
    function _removeHandler(target, eventType, handler){
        if(target.removeEventListener){//主流浏览器
            removeHandler = function(target, eventType, handler){
                target.removeEventListener(eventType, handler, false);
            }
        }else{//IE
            removeHandler = function(target, eventType, handler){
                target.detachEvent("on"+eventType, handler);
            }
        }
        //执行新的函数
        removeHandler(target, eventType, handler);
    }
    function _fetchUrlScheme(url){
        var ret = {
            protocol : null , //
            path : null ,
            params : {} ,
        } ;
        // ehsy://user/register
        var portoclArr = url.split( '//' ) ;
        if ( portoclArr.length > 1 ){
            ret.protocol = portoclArr[0] ;
            var pathArr = portoclArr[ 1 ].split( '?' ) ;
            if ( pathArr.length > 1 ){
                ret.path = pathArr[ 0 ] ;
                var paramsArr = pathArr[ 1 ].split( '&' ) ;
                paramsArr.forEach(function (v) {
                    var keyValue = v.split( '=' ) ;
                    ret.params[ keyValue[0] ] = keyValue[1] ;
                }) ;
            } else {
                ret.path = pathArr[ 0 ] ;
            }
        }
        return ret ;
    }
    function _getParentsArchor( ele ){
        var ret ;
        if ( ele.tagName === 'A' ){
            ret = ele ;
        } else {
            while ( ele.parentNode && ele.parentNode.tagName ){
                ele = ele.parentNode ;
                if ( ele.tagName === 'A' ){
                    ret = ele ;
                    break ;
                }
            }
        }
        return ret ;
    }
    function _isFunction( i ){
        return typeof i === 'function' ;
    }
    function _isObject( i ){
        return Object.prototype.toString.call( i ) === '[object Object]'
    }


    /*
    * Module
    * */
    function Module(config){
        this.config = config ;
        this.store = {} ;
    } ;
    Module.prototype.put = function(moduleName,module) {
        ( typeof this.store[ moduleName ] === 'undefined' ) && ( this.store[ moduleName ] = module ) ;
    } ;
    Module.prototype.get = function(moduleName){
        if ( typeof this.store[ moduleName ] !== 'undefined' ){
            // if ( moduleName.charAt(0) ===　'_'　){
            //     throw new Error( 'module "' + moduleName　+ '" is private module.' ) ;
            // }　else　{
                return this.store[ moduleName ]  ;
            // }
        } else {
            throw new Error( 'module "' + moduleName + '" not exist.' ) ;
        }
    } ;
    var module = new Module({
        /*
        * 配置, 然而, 不知道要配置些啥。
        * */
    }) ;

    /*
    * Features
    * */

    /*
    * Main Constructor
    * */
    ;(function(){
        function Ehsy(){
            //default open
            this.message = new ( module.get( 'Message' ) ) ;
            this.template = module.get( 'Template' ) ; //构造器
            this.weixin = new ( module.get( 'Weixin' ) )( config.weixin ) ;
            this.cookie = new ( module.get( 'Cookie' ) )( config.cookie ) ;
            //default close
            this.analytics = new ( module.get( 'Analytics' ) )( config.analytics ) ;
            // this.user = new ( module.get( 'User' ) ) ;
        }
        Ehsy.prototype.init = function(options,arr,callback){
            if ( _isArray( options ) && _isFunction( arr ) ){
                this._inject( options , arr ) ;
            } else if ( _isObject( options ) ){
                this.config( options ) ;
                if ( _isArray( arr ) && _isFunction( callback ) ){
                    this._inject( arr , callback ) ;
                }
            }
        } ;
        Ehsy.prototype._inject = function(arr,callback){
            var args = [] ;
            var l = arr.length ;
            for ( var i = 0 ; i < l ; i++ ){
                args.push( this[ arr[ i ] ] ) ;
            }
            callback && callback.apply( this , args ) ;
        }
        Ehsy.prototype.config = function(options,value){
            if ( typeof options === 'object' ) {
                var utils = module.get( '_utils' ) ;
                for ( var _o in options ){
                    if ( options.hasOwnProperty( _o ) ){
                        this._config( _o , options[ _o ] ) ;
                        // this[ _o ] && ( this[ _o ] = new ( module.get( utils.firstUpperCase( _o ) ) )( options[ _o ] ) ) ;
                    }
                }
            } else {
                if ( typeof this[ options ] === 'undefined' ){
                    throw new Error( 'there is no module named "' + options + '"' ) ;
                } else {
                    var utils = module.get( '_utils' ) ;
                    this._config( options , value ) ;
                    // this[ options ] = new ( module.get( utils.firstUpperCase( options ) ) )( value ) ;
                }
            }
        } ;
        Ehsy.prototype._config = function(moduleName,options){
            var self = this ;
            var utils = module.get( '_utils' ) ;
            var moduleCons = module.get( utils.firstUpperCase( moduleName ) ) ;

            switch ( moduleName ){
                case 'message' :
                    if ( typeof options !== 'object' ){
                        throw new Error( 'moulde "message" config must be a Object.' ) ;
                    } else {
                        for ( var _o in options ){
                            config.message[ _o ] && ( config.message[ _o ] = options[ _o ] ) ;
                        }
                    }
                    break ;
                case 'template' :
                    if ( typeof options !== 'object' ){
                        throw new Error( 'moulde "template" config must be a Object.' ) ;
                    } else {
                        for ( var _o in options ){
                            if ( _o === 'supportAttr' ){
                                var newAttrName = options[ _o ] ;
                                if ( typeof newAttrName === 'string' ){
                                    if ( config.template.supportAttr.indexOf( options[ _o ] ) === -1 ){
                                        config.template.supportAttr.push( newAttrName ) ;
                                    }
                                } else if ( _isArray( newAttrName ) ) {
                                    for ( var _i = 0 ; _i < newAttrName.length ; _i++ ){
                                        if ( config.template.supportAttr.indexOf( newAttrName[ _i ] ) === -1 ){
                                            config.template.supportAttr.push( newAttrName ) ;
                                        }
                                    }
                                }
                            } else {
                                config.template[ _o ] && ( config.template[ _o ] = options[ _o ] )
                            }
                        }
                    }
                    break ;
                case 'weixin' :
                    console.warn( 'module : "weixin" dont support config.') ;
                    break ;
                case 'cookie' :
                    if ( typeof options !== 'object' ){
                        throw new Error( 'module "cookie" config must be a Object.' ) ;
                    } else {
                        for ( var _o in options ){
                            if ( typeof options[ _o ] !== 'string' ){
                                throw new Error( 'cookie\'s key must be a String.' )
                            } else {
                                config.cookie[ _o ] = options ;
                            }
                        }
                        this.cookie = new moduleCons( config.cookie ) ;
                    }
                    break ;
                case 'analytics' :
                    config.analytics = options ;
                    this.analytics.init( config.analytics ) ;
                    // this.analytics = new moduleCons( config.analytics.source ) ;
                    break ;
                case 'user' :
                    break ;
                default :
                    throw new Error( 'there is no module called "' + moduleName + '" can config.' ) ;
                    break ;
            }
        } ;
        Ehsy.constructorName = config.identity.sdk ;

        module.put( 'Ehsy' , Ehsy ) ;
    })() ;
    /*
    * Partials Constructor
    * */
    ;(function () {
        /*
        * Message
        * */
        ;(function(){
            function _senderHandle( event ){
                var archor = _getParentsArchor( event.srcElement ) ;
                if ( typeof archor !== 'undefined' ){
                    if ( !!config.message.sender ){
                        if ( typeof window.top.postMessage === 'undefined' ){
                            console.warn( '您的浏览器不支持页面消息发送, 请换用较新的浏览器。' ) ;
                        } else {
                            var url = archor.href ;
                            _navigate( url , event ) ;
                        }
                    }
                }
            }
            function _navigate( url , event ){
                var urlLocation = _fetchUrlScheme( url ) ;
                //HTTP 尚未支持
                if ( urlLocation.protocol === config.message.protocol ){
                    event.preventDefault() ;
                    switch ( urlLocation.path ){
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
                        //
                        case 'product/list' :
                        //跳转到商品列表页
                        //
                        case 'product/detail' :
                            //跳转到商品详情页
                            if ( _isInEhsyM() ){
                                window.top.postMessage && window.top.postMessage({
                                    type : 'URLSchemes' ,
                                    data : urlLocation ,
                                }, '*' ) ;
                            } else {
                                window.postMessage && window.postMessage({
                                    type : 'URLSchemes' ,
                                    data : urlLocation ,
                                }, '*' ) ;
                            }
                            break ;
                    }
                }
            }
            function _receiverHandle(event){
                var origin = event.origin ;
                if ( /ehsy.com/.test( origin ) ){
                    if ( !!config.message.receiver ){
                        var data = event.data ;
                        _operation( data ) ;
                    }
                }
            }
            function _operation( data ){
                if ( data.type === 'URLSchemes' ){
                    _ope_URLSchemes( data.data ) ;
                }

                function _ope_URLSchemes( data ){
                    var urlLocation = data ;
                    if ( urlLocation.protocol === 'ehsy:' ){
                        if ( _isFunction( config.message.customerAction[ urlLocation.path ] ) ){
                            config.message.customerAction[ urlLocation.path ]( urlLocation ) ;
                        } else {
                            switch ( urlLocation.path ) {
                                case 'user/register' :
                                    //跳转到快速注册页
                                    window.location.href = '/register' ;
                                    break ;
                                case 'user/login' :
                                    //跳转到用户登录页
                                    try{
                                        var myApp = new Framework7() ;
                                        myApp.loginScreen();
                                    } catch (e){
                                        console.warn( '您的页面未能找到framework环境, 无法调出登录组件' ) ;
                                    }
                                    break ;
                                case 'user/identify' :
                                    //跳转到用户认证页面
                                    window.location.href = '/auth' ;
                                    break ;
                                case 'cart/open' :
                                    //打开购物车页面
                                    window.location.href = '/checkout/cart' ;
                                    break ;
                                case 'cart/add' :
                                    //加入购物车
                                    var pid = urlLocation.params.pid ; //数量写死为1
                                    window.globalSignle && window.globalSignle.addToCart( pid , '1' ) ;
                                    break　;
                                case 'my/notice' :
                                    //进入消息中心页面
                                    window.location.href = '/message' ;
                                    break ;
                                case 'my/account' :
                                    //进入账户管理
                                    console.warn( '当前移动网站暂无账户管理页面' ) ;
                                    break ;
                                case 'my/address' :
                                    //打开收货地址页面
                                    window.location.href = '/my_ehsy#my_address' ;
                                    break ;
                                case 'my/invoice' :
                                    //打开发票抬头
                                    window.location.href = '/my_ehsy#main_invoice' ;
                                    break ;
                                case 'my/favorite' :
                                    //我的收藏页面（实际跳转app页面与“我的足迹”同）
                                    window.location.href = '/my_ehsy#my_collection' ;
                                    break ;
                                case 'my/history' :
                                    //我的足迹（实际跳转app页面与“我的收藏页面”同）
                                    console.warn( '当前移动网站暂无我的足迹页面' ) ;
                                    break ;
                                case 'my/coupon' :
                                    //优惠券页面
                                    console.warn( '当前移动网站暂无优惠券页面' ) ;
                                    break ;
                                case 'home' :
                                case '' :
                                    //首页
                                    window.location.href = '/' ;
                                    break ;
                                case 'my/order' :
                                    //订单 my/order?type=1
                                    window.location.href = '/my_ehsy#my_order' ;
                                    // console.warn( '当前移动网站暂不支持打开订单分类页面' ) ;
                                    break ;
                                case 'product/channel' :
                                    //跳转至商品频道（一级分类）页   'product/channel?cid=8&name=工具'
                                    var cid = urlLocation.params.cid ;
                                    _get('/api/config/channel_list' ,function (result) {
                                        var channels = result.channels ;
                                        var oneChannel = channels.find(function (data) {
                                            return data.catId == cid ;
                                        }) ;
                                        window.location.href = oneChannel.actionUrl ;
                                    }) ;
                                    break ;
                                case 'product/brand' :
                                    //跳转到商品品牌页
                                    //bid [必填]: 商品品牌ID     cid [可选]: 商品分类ID //
                                    var queryString = '' ;
                                    if ( urlLocation.params.cid ){
                                        queryString = '?cid=' + urlLocation.params.cid ;
                                    }
                                    window.location.href = '/brand-' + urlLocation.params.bid + queryString ;
                                    break ;
                                case 'product/list' :
                                    //跳转到商品列表页
                                    //cid [必填]: 商品分类ID   bid [可选]: 商品品牌ID
                                    window.location.href = '/search?cid=' + urlLocation.params.cid + ( urlLocation.params.bid ? '&bid=' + urlLocation.params.bid : '' ) ;
                                    break ;
                                case 'product/detail' :
                                    //跳转到商品详情页
                                    //pid [必填]: 商品SKU
                                    window.location.href = '/product-' + urlLocation.params.pid ;
                                    break ;
                            }
                        }
                    }
                }
            }

            function Receiver() {
                this.init() ;
            }
            Receiver.prototype.init = function(){
                _addHandler( window , 'message' , _receiverHandle ) ;
            }
            function Sender(){
                this.init() ;
            }
            Sender.prototype.init = function(){
                _addHandler( document , 'click' , _senderHandle ) ;
            }

            module.put( '_Receiver' , Receiver ) ;
            module.put( '_Sender' , Sender ) ;
        })();

        var Receiver = module.get( '_Receiver' ) ;
        var Sender = module.get( '_Sender' ) ;

        function Message(){
            //改变config的值能即刻对页面中的消息发送做处理
            if ( _isInEhsyApp() ){
                config.message.sender = false ;
            } else {
                config.message.sender = true ;
            }
            if ( !_isInEhsyApp() && !_isInEhsyM() ){
                config.message.receiver = true ;
            } else {
                config.message.receiver = false ;
            }

            this.sender = new Sender() ;
            this.receiver = new Receiver() ;
        }
        module.put( 'Message' , Message ) ;
    })() ;
    ;(function(){
        /*
        * Template
        * */
        ;(function(){

            function EBinding( element , data ){
                this.ele = element ;
                this.data = data ;

                this._init() ;
            }
            EBinding.prototype._init = function () {

                var relationShip = [] ;

                function _deepFind( ele ){
                    if ( ele.nodeType === 1 ){
                        var cof = config.template.supportAttr ;
                        var l = cof.length ;
                        for ( var i = 0 ; i < l ; i++ ){
                            var attrName = cof[ i ] ;
                            var attrValue = _getBindAttr( ele , attrName ) ;
                            if ( attrValue !== null ){
                                if ( attrName === 'class' ){
                                    relationShip.push({
                                        element : ele ,
                                        attrName : attrName ,
                                        attrValue : attrValue ,
                                        originClass : _getClass( ele ) ,
                                    }) ;
                                } else {
                                    relationShip.push({
                                        element : ele ,
                                        attrName : attrName ,
                                        attrValue : attrValue
                                    }) ;
                                }
                            }
                        }
                        //text binding
                        var textAttr = _getAttr( ele , 'e-bind' ) ;
                        if ( textAttr !== null ){
                            if ( ele.childNodes.length == 0 ){
                                relationShip.push({
                                    element : ele ,
                                    attrName : 'text' ,
                                    attrValue : textAttr
                                }) ;
                            } else if ( ele.childNodes.length == 1 && ele.childNodes[0].nodeType === 3 ){
                                relationShip.push({
                                    element : ele ,
                                    attrName : 'text' ,
                                    attrValue : textAttr
                                }) ;
                            } else {
                                console.warn( '"e-bind" should make sure your element is empty or only has TextNode.' ) ;
                            }
                        }
                        if ( ele.hasChildNodes() ){
                            var len = ele.childNodes.length ;
                            for ( var j=0; j<len ;j++ ){
                                _deepFind( ele.childNodes[j] ) ;
                            }
                        }
                    } else if ( ele.nodeType === 3 ){
                        var nodeText = ele.data ;
                        if ( config.template.mustache.test( nodeText ) ){
                            var a = nodeText.match( config.template.mustache )[0] ;
                            relationShip.push({
                                element : ele ,
                                attrName : 'text' ,
                                attrValue : a.slice( 2, a.length-2 ) ,
                                originStr : nodeText
                            }) ;
                        }
                    }
                }
                _deepFind( this.ele ) ;

                this._binding = relationShip ;
                this._render() ;
            }
            EBinding.prototype._render = function(){
                var relationShip = this._binding ;
                var sourceData = this.data ;

                var len = relationShip.length ;
                for ( var i = 0 ; i < len ; i++ ){
                    var curRelation = relationShip[ i ] ,
                        attrName = curRelation.attrName ,
                        targetDom = curRelation.element ,
                        attrValue = curRelation.attrValue ,
                        realData = _objectStringFind( sourceData , attrValue ) ;

                    switch ( attrName ){
                        case 'title' :
                        case 'href' :
                        case 'src' :
                            targetDom.setAttribute( attrName , realData ) ;
                            break ;
                        case 'class' :
                            //需要记下 变换前的原始class
                            if ( !!curRelation.originClass ){
                                if ( realData.trim() === '' ){
                                    _setClass( targetDom , curRelation.originClass ) ;
                                } else {
                                    _addClass( targetDom , realData ) ;
                                }
                            }
                            break ;
                        case 'text' :
                            if ( !!curRelation.originStr ){
                                targetDom.data = curRelation.originStr.replace( config.template.mustache , realData ) ;
                            } else {
                                targetDom.innerHTML =  _html_encode( realData + '' ) ;
                            }
                            break ;
                        default :
                            console.warn( 'not support attribute named ' + attr ) ;
                            break ;
                    }
                }
            }
            EBinding.prototype.refresh = function (data) {
                this.data = data ;
                this._render() ;
            }
            

            module.put( '_EBinding' , EBinding ) ;
        })();

        var EBinding = module.get( '_EBinding' ) ;

        function Template(element,data){
            if ( !( ( element instanceof HTMLElement ) || ( typeof element === 'string' ) ) || ( typeof data !== 'object' ) ){
                throw new Error( 'dataBinding should between HTMLElement and javascript Object' ) ;
            }
            //attr
            this.originData = data ;
            if ( element instanceof HTMLElement ){
                this.originEle = element ;
            } else {
                this.originEle = _query(element);
            }
            this.binding = [] ; //data binding
            this._init() ;
        }
        Template.prototype._init = function () {
            //按照当前所支持的范式来初始化
            var ele = this.originEle ,
                data = this.originData ,
                self = this ;
            // var listName = _getAttr( ele , 'e-for' ) ;
            if ( !_isArray( data ) ){
                //object 式
                this.binding = [ this._renderElement( ele , data ) ] ;
            } else {
                //array 式
                this.binding = this._renderList( ele , data ) ;
            }
        }
        Template.prototype._renderElement = function( ele , data ){
            var binding = new EBinding( ele , data ) ;
            return binding ;
        }
        Template.prototype._renderList = function(){
            var self = this ,
                originEle = this.originEle ,
                originData = this.originData ;

            if ( !_isArray( originData ) ){
                throw new Error( '"e-for" data must be a Array.' ) ;
            }

            var len = originData.length - 1 ;
            var listEle = [ originEle ] ;
            var curEle = originEle ;
            for ( var _i = 0 ; _i < len ; _i++ ){
                var newEle = originEle.cloneNode( true ) ;
                listEle.push( newEle ) ;
                _after( newEle , curEle ) ;
                curEle = newEle ;
            }

            //clone出了一排
            // var listEle = document.getElementsByClassName( 'ad-form-item' ) ;
            var len = listEle.length ;
            var bTmp = [] ;
            for ( var i=0 ; i<len ; i++ ){
                bTmp.push( self._renderElement( listEle[ i ] , originData[ i ] ) ) ;
            }
            return bTmp ;
        }
        Template.prototype.refresh = function(data){
            if ( typeof data === 'undefined' ) {
                data = this.originData ;
            }
            for ( var i = 0 ; i < this.binding.length ; i++ ){
                if ( _isArray( data ) ){
                    this.binding[ i ].refresh( data[ i ] ) ;
                } else {
                    this.binding[ i ].refresh( data ) ;
                }
            }
        } ;
        module.put( 'Template' , Template ) ;
    })() ;
    ;(function () {
        /*
         * Weixin
         * */
        var DEFAULT_LINK = window.location.href.split('#').shift()  ;
        var DEFAULT_TITLE = '西域-专业MRO自营电商' ;
        var DEFAULT_DESC = window.document.title || '西域-MRO工业品|MRO供应商|MRO整合|MRO领导者—西域-专业MRO自营电商' ;
        var DEFAULT_IMGURL = 'http://static-c.ehsy.com/content/1612/logo_128_128.png' ;
        var DEFAULT_TYPE = 'link' ;
        var DEFAULT_DATAURL = '' ;
        var DEFAULT_SUCCESS = function () {
            console.log( '操作成功' ) ;
        }
        var DEFAULT_CANCEL = function(){
            console.log( '操作取消' ) ;
        }

        function Weixin(config) {
            //attr
            this.sdkUrl = config.sdkUrl ;

            //prop
            this.isReady = false ; //这个ready承载着wx和签名双双成功的状态
            this.jsApiList = [
                'onMenuShareAppMessage' ,
                'onMenuShareTimeline' ,
                'onMenuShareQQ' ,
                'onMenuShareWeibo' ,
                'onMenuShareQZone'
            ] ;
            this.eventList = [] ;
            this.defaultValue = {
                onMenuShareAppMessage : {
                    title: DEFAULT_TITLE , // 分享标题
                    desc: DEFAULT_DESC , // 分享描述
                    link: DEFAULT_LINK , // 分享链接
                    imgUrl: DEFAULT_IMGURL , // 分享图标
                    type: DEFAULT_TYPE , // 分享类型,music、video或link，不填默认为link
                    dataUrl: DEFAULT_DATAURL , // 如果type是music或video，则要提供数据链接，默认为空
                    success: DEFAULT_SUCCESS ,
                    cancel: DEFAULT_CANCEL ,
                },
                onMenuShareTimeline : {
                    title: DEFAULT_TITLE , // 分享标题
                    link: DEFAULT_LINK , // 分享链接
                    imgUrl: DEFAULT_IMGURL , // 分享图标
                    success: DEFAULT_SUCCESS ,
                    cancel: DEFAULT_CANCEL ,
                },
                onMenuShareQQ : {
                    title: DEFAULT_TITLE , // 分享标题
                    desc: DEFAULT_DESC , // 分享描述
                    link: DEFAULT_LINK , // 分享链接
                    imgUrl: DEFAULT_IMGURL , // 分享图标
                    success: DEFAULT_SUCCESS ,
                    cancel: DEFAULT_CANCEL
                },
                onMenuShareWeibo : {
                    title: DEFAULT_TITLE , // 分享标题
                    desc: DEFAULT_DESC , // 分享描述
                    link: DEFAULT_LINK , // 分享链接
                    imgUrl: DEFAULT_IMGURL , // 分享图标
                    success: DEFAULT_SUCCESS ,
                    cancel: DEFAULT_CANCEL
                },
                onMenuShareQZone : {
                    title: DEFAULT_TITLE　, // 分享标题
                    desc: DEFAULT_DESC　, // 分享描述
                    link: DEFAULT_LINK　, // 分享链接
                    imgUrl: DEFAULT_IMGURL　, // 分享图标
                    success: DEFAULT_SUCCESS　,
                    cancel: DEFAULT_CANCEL
                }
            } ;

            this._init() ;
        }
        var shareApi = [
            'onMenuShareAppMessage' , //分享给好友
            'onMenuShareTimeline' , //分享到朋友圈
            'onMenuShareQQ' , //分享到QQ
            'onMenuShareWeibo' , //分享到腾讯微博
            'onMenuShareQZone' //分享到QQ空间
        ] ;
        shareApi.forEach(function(v){
            Weixin.prototype[ v ] = function(config){
                if ( !this.isReady ){
                    this.eventList.push({
                        funcName : v ,
                        args : this._configMixin( v , config )
                    }) ;
                } else {
                    wx[ v ]( this._configMixin( v , config ) ) ;
                }
            }
        })
        //utils
        Weixin.prototype._configMixin = function(operation,config){
            var defaultObj = this.defaultValue[ operation ] ;
            var resultObj = defaultObj ;
            for ( var _v in config ){
                if ( config.hasOwnProperty( _v ) ){
                    resultObj[ _v ] = config[ _v ] ;
                }
            }
            return resultObj ;
        }
        Weixin.prototype._checkEnv = function(){
            return _isWeixin() ;
        }
        Weixin.prototype._init = function () {
            if ( !this._checkEnv() ){
                console.warn( '当前浏览器不为微信环境, 不会为你初始化微信jsdk。' ) ;
                return ;
            }
            var self = this ;
            var utils = module.get( '_utils' ) ;
            utils.insertScript( self.sdkUrl , function(options){
                _get('/api/fetchWechatSignature?url=' + encodeURIComponent( DEFAULT_LINK ) ,function (result) {
                    if ( result && result.mark == '0' ){
                        self.isReady = true ;
                        wx.config({
                            // debug: true,
                            appId: result.appId ,
                            timestamp: result.timestamp ,
                            nonceStr: result.nonceStr ,
                            signature: result.signature ,
                            jsApiList: self.jsApiList ,
                        });
                        wx.ready(function() {
                            self.eventList.forEach(function (value) {
                                value.funcName &&  wx[ value.funcName ] && ( typeof wx[ value.funcName ] === 'function' ) && wx[ value.funcName ].call( self , value.args ) ;
                            }) ;
                        }) ;
                        wx.error(function(res){
                            console.warn( 'weixin jsdk occured a problem :' + res.errMsg ) ;
                        }) ;
                    } else {
                        console.warn( '微信jsdk初始化失败, 请确认是否处于微信环境中。' ) ;
                    }
                },function(){
                    throw new Error( 'fetch Weixin signature failed , please check your network.' ) ;
                }) ;
            },function(options){
                throw new Error( 'cant load srcipt form ' + options.url + ' , please check your network.' ) ;
            }) ;

        } ;

        module.put( 'Weixin' , Weixin ) ;

    })() ;
    ;(function () {
        /*
         * Cookie
         * */
        var pluses = /\+/g;
        function encode(s) {
            return config.raw ? s : encodeURIComponent(s);
        }
        function decode(s) {
            return config.raw ? s : decodeURIComponent(s);
        }
        function stringifyCookieValue(value) {
            return encode(config.json ? JSON.stringify(value) : String(value));
        }
        function parseCookieValue(s) {
            if (s.indexOf('"') === 0) {
                // This is a quoted cookie as according to RFC2068, unescape...
                s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            }
            try {
                // Replace server-side written pluses with spaces.
                // If we can't decode the cookie, ignore it, it's unusable.
                // If we can't parse the cookie, ignore it, it's unusable.
                s = decodeURIComponent(s.replace(pluses, ' '));
                return config.json ? JSON.parse(s) : s;
            } catch(e) {}
        }
        function read(s, converter) {
            var value = config.raw ? s : parseCookieValue(s);
            return _isFunction(converter) ? converter(value) : value;
        }
        function _isFunction(func){
            return typeof func === 'function' ;
        }
        var config = function (key, value, options) {
            // Write
            if (value !== undefined && !_isFunction(value)) {
                var utils = module.get( '_utils' ) ;
                options = utils.extend({}, config.defaults, options) ;

                // options = $.extend({}, config.defaults, options);

                if (typeof options.expires === 'number') {
                    var days = options.expires, t = options.expires = new Date();
                    t.setTime(+t + days * 864e+5);
                }
                return (document.cookie = [
                    encode(key), '=', stringifyCookieValue(value),
                    options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                    options.path    ? '; path=' + options.path : '',
                    options.domain  ? '; domain=' + options.domain : '',
                    options.secure  ? '; secure' : ''
                ].join(''));
            }
            // Read
            var result = key ? undefined : {};
            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all. Also prevents odd result when
            // calling $.cookie().
            var cookies = document.cookie ? document.cookie.split('; ') : [];
            for (var i = 0, l = cookies.length; i < l; i++) {
                var parts = cookies[i].split('=');
                var name = decode(parts.shift());
                var cookie = parts.join('=');
                if (key && key === name) {
                    // If second argument (value) is a function it's a converter...
                    result = read(cookie, value);
                    break;
                }
                // Prevent storing a cookie that we couldn't decode.
                if (!key && (cookie = read(cookie)) !== undefined) {
                    result[name] = cookie;
                }
            }
            return result;
        };
        config.defaults = {};
        var removeCookie = function (key, options) {
            if ( config(key) === undefined) {
                return false;
            }
            var utils = module.get( '_utils' ) ;
            options = utils.extend({}, config.defaults, options) ;
            // Must not alter options, thus extending a fresh object...
            config(key, '', utils.extend({}, options, { expires: -1 }));
            return !config(key);
        };
        function Cookie(config) {
            for( var _o in config ){
                if ( config.hasOwnProperty( _o ) ){
                    if ( typeof this[ _o ] !== 'undefined' ){
                        throw new error( 'cookie name "' + _o + '" is not allowed.') ;
                    } else {
                        this[ _o ] = this.config( config[ _o ] ) ;
                    }
                }
            }
        }
        Cookie.prototype.get = config ;
        Cookie.prototype.config = config ;
        Cookie.prototype.removeCookie = removeCookie ;

        module.put( 'Cookie' , Cookie ) ;
    })() ;
    ;(function () {
        /*
         * Analytics
         * */
        /*
        * 直接返回待插入页面中的script元素
        * */
        var analyticsScriptElement = {
            // '友盟统计' : function(){
            //     var sEl = document.createElement( 'script' ) ;
            //     sEl.src = '//s4.cnzz.com/z_stat.php?id=1259301846&web_id=1259301846' ;
            //     sEl.language = 'JavaScript' ;
            //     return sEl ;
            //     // return '<script src="//s4.cnzz.com/z_stat.php?id=1259301846&web_id=1259301846" language="JavaScript"></script>'
            // } ,
            '百度统计' : function(){
                var sEl = document.createElement( 'script' ) ;
                sEl.innerHTML = (
                    'var _hmt = _hmt || [];' +
                    '(function () {' +
                        'var hm = document.createElement("script");' +
                        'hm.src = "//hm.baidu.com/hm.js?840dfcdcb73850d4104d08cf888af8c0";' +
                        'var s = document.getElementsByTagName("script")[0];' +
                        's.parentNode.insertBefore(hm, s);' +
                    '})();' ) ;
                return sEl ;
            } ,
            '百度推送' : function(){
                var sEl = document.createElement( 'script' ) ;
                sEl.innerHTML = (
                    "(function () {" +
                        "var bp = document.createElement('script');" +
                        "var curProtocol = window.location.protocol.split(':')[0];" +
                        "if (curProtocol === 'https') {"+
                            "bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';" +
                        "}" +
                        "else {" +
                            "bp.src = 'http://push.zhanzhang.baidu.com/push.js';" +
                        "}" +
                        "var s = document.getElementsByTagName('script')[0];" +
                        "s.parentNode.insertBefore(bp, s);" +
                    "})();" ) ;
                return sEl ;
            } ,
            '谷歌统计' : function(){
                var sEl = document.createElement( 'script' ) ;
                sEl.innerHTML = (
                    "(function (i, s, o, g, r, a, m) {" +
                        "i['GoogleAnalyticsObject'] = r;" +
                        "i[r] = i[r] || function () {" +
                                "(i[r].q = i[r].q || []).push(arguments)" +
                            "}, i[r].l = 1 * new Date();" +
                        "a = s.createElement(o)," +
                            "m = s.getElementsByTagName(o)[0];" +
                        "a.async = 1;" +
                        "a.src = g;" +
                        "m.parentNode.insertBefore(a, m)" +
                    "})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');" +
                    "ga('create', 'UA-83062421-1', 'auto');" +
                    "ga('send', 'pageview');"
                ) ;
                return sEl ;
            }
        }

        function Analytics(supportArr) {
            if ( !_isArray( supportArr ) ){
                throw new Error( 'analytics config params must be a Array.' ) ;
            }
            this.list = supportArr ;
            // this._init() ;
        }
        Analytics.prototype.init = function( inlist ){
            if ( typeof inlist !== 'undefined' ){
                this.list = inlist ;
            }

            var len = this.list.length ;
            var list = this.list ;

            //判断是否以前曾配置过
            var targetEle = document.getElementsByClassName( config.identity.analyticsClassName )[0] ;
            if ( typeof targetEle === 'undefined' ){
                targetEle = document.createElement( 'div' ) ;
                targetEle.className = config.identity.analyticsClassName ;
                targetEle.style.display = 'none' ;
            } else {
                console.warn( 'you has been config the analytics, it may cause some problem.' ) ;
            }

            for ( var i = 0 ; i < len ; i++ ){
                if ( typeof analyticsScriptElement[ list[ i ] ] === 'undefined' ){
                    console.warn( 'analytics source invalid.' ) ;
                } else {
                    targetEle.appendChild( analyticsScriptElement[ list[ i ] ]() ) ;
                }
            }

            document.getElementsByTagName( 'head' )[0].appendChild( targetEle ) ;
        }
        module.put( 'Analytics' , Analytics ) ;
    })() ;
    ;(function () {
        /*
         * User
         * */
        function User() {

        }
        module.put( 'User' , User ) ;
    })() ;

    /*
    * Private Utils Module
    * */
    ;(function (){
        var netWork = {
            ajax : function(config) {

            },
            get : function(url){

            },
            post : function(url,body){

            }
        } ;

        var utils = window.test = {
            /*
            * 深拷贝
            * */
            extend : function( targetObj ){
                var srcObjArr = Array.prototype.slice.apply( arguments , [1] ) ;
                srcObjArr.forEach(function( srcObj ){
                    _deepCopy( targetObj , srcObj ) ;
                }) ;
                return targetObj ;
            } ,
            /*
            * 首字母大写
            * */
            firstUpperCase: function (string) {
                if ( typeof string !== 'string' || string.length === 0 ){
                    throw new Error( 'module config name except to a String.') ;
                }
                return string.slice(0,1).toUpperCase() + string.slice(1) ;
            },
            /*
            * 动态脚本
            * */
            insertScript : function(url,successCal,errorCal){
                var sEle = document.createElement( 'script' ) ;
                sEle.src = url ;
                sEle.type = 'text/javascript' ;
                document.getElementsByTagName( 'head' )[0].appendChild( sEle ) ;
                _addHandler( sEle , 'load' , function(ev){
                    successCal && successCal({
                        url : url ,
                        ev : ev
                    }) ;
                }) ;
                _addHandler( sEle , 'error' , function(ev){
                    errorCal && errorCal({
                        url : url ,
                        ev : ev
                    }) ;
                }) ;
            }
        } ;

        ;(function(){
            /*
             * 事件总线
             * */
            var eventStore = {

            } ;
            utils.onEvent = function( eventName , callback ){
                if ( typeof callback === 'function' ){
                    if ( _isArray( eventStore[ eventName ] ) ){
                        eventStore[ eventName ].push( callback ) ;
                    } else {
                        eventStore[ eventName ] = [] ;
                    }
                } else {
                    throw new Error( 'callback must be a funtion.' ) ;
                }
            } ;
            utils.triggerEvent = function( eventName , options ){
                eventStore[ eventName ].forEach(function (cal) {
                    if ( typeof callback === 'function' ){
                        cal && cal( options ) ;
                    }
                }) ;
            } ;
        })();

        module.put( '_netWork' , netWork ) ;
        module.put( '_utils' , utils ) ;

    })() ;


    /* 
    * bootstrap
    */
    ;(function(){
        window.ehsy_sdk = window.ehsySdk = window.ehsySDK = window.ehsy_SDK = new ( module.get( 'Ehsy' ) ) ;
    })() ;
})() ;
