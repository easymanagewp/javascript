/**
 * Created by 王鹏 on 2015/8/12.
 * LoginAcion 对Login方法进行封装与解析
 */
define(function(){
    var defaultOptions = {
        url : "",                                                               /* 登录数据提交地址 */
        md5 : true,                                                             /* 是否对密码进行MD5加密 */
        loginNameKey : "loginName",                                         /* 用户名的提交参数名称 */
        passwordKey : "password",                                           /* 登录密码的提交参数名称 */
        validateCodeKey : "code",                                           /* 验证码的提交参数名称 */
        loginNameElement : ":input[name='"+this.loginNameKey+"']",      /* 用户名页面元素 */
        passwordElement : ":input[type='password']",                            /* 用户密码页面元素 */
        validateCodeElement : ":input[name='"+this.validateCodeKey+"']",    /* 验证码元素 */
        successUrl : "",                                                             /* 登录成功跳转路径 */
        hint : function(msg,element){                                               /* 错误提示 */
            require(['requirejs-utils'],function(utils){
                utils.alert(msg);
                element.focus();
            })
        }
    };

    var Login = function(){}

    /**
     * 初始化Login对象信息
     * @param options
     * 以下为参数信息，参数名后的值为默认值
     *  url : "",                                                                登录数据提交地址
     * md5 : true,                                                              是否对密码进行MD5加密
     * loginNameKey : "loginName",                                              用户名的提交参数名称
     * passwordKey : "password",                                                登录密码的提交参数名称
     *  validateCodeKey : "code",                                               验证码的提交参数名称
     * loginNameElement : ":input[name='"+this.loginNameKey+"']",               用户名页面元素
     * passwordElement : ":input[type='password']",                            用户密码页面元素
     * validateCodeElement : ":input[name='"+this.validateCodeKey+"']",         验证码元素
     * hint : function(nsg,element){                                            错误信息提示
     *     require(['utils'],function(utils){
     *       utils.alert(msg);
     *       element.focus()
     *     }
    *   }
     */
    Login.prototype.init = function(options){
        this._options = $.extend({}.defaultOptions,options);
    }

    /**
     * 获取用户名
     * @returns 用户填写的用户名数据
     */
    Login.prototype.getLoginName = function(){
        return this.getLoginNameElement().val();
    }

    /**
     * 获取用户名元素
     * @returns 用户名元素
     */
    Login.prototype.getLoginNameElement = function(){
        return $(this._options.loginNameElement);
    }

    /**
     * 获取输入的用户密码
     * @returns 用户填写的密码
     */
    Login.prototype.getPassword = function(){
        return this.getPasswordElement().val();
    }

    /**
     * 获取用户密码Html元素
     * @returns 用户密码Html元素
     */
    Login.prototype.getPasswordElement = function(){
        return $(this._options.passwordElement);
    }

    /**
     * 获取用户输入的验证码
     * @returns 用户填写的验证码
     */
    Login.prototype.getValidateCode = function(){
        return this.getValidateCodeElement().val();
    }

    /**
     * 获取用户验证码html元素
     * @returns 用户验证码html元素
     */
    Login.prototype.getValidateCodeElement = function(){
        return $(this._options.validateCodeElement);
    }

    /**
     * 执行登录操作
     */
    Login.prototype.action = function(){
       require(['http','md5','requirejs-utils'],function(http,md5,utils){

           /*
           获取参数信息
            */
           var params = {};
           params[this._options.loginNameKey] = this.getLoginName();
           params[this._options.validateCodeKey] = this.getValidateCode();
           if(this._options.md5){
               params[this._options.passwordKey] = md5(this.getPassword());
           }else{
               params[this._options.passwordKey] = this.getPassword();
           }

           /*
           验证参数信息
            */
           if(utils.strIsBlankOrNull(params[this._options.loginNameKey])){
               this._options.hint("用户名不能为空，请填写用户名",this.getLoginNameElement());
               return false;
           }

           if(utils.strIsBlankOrNull(params[this._options.passwordKey])){
               this._options.hint("用户密码不允许为空，请填写用户密码",this.getPasswordElement());
               return false;
           }

           if(utils.strIsBlankOrNull(params[this._options.validateCodeKey])){
               this._options.hint("验证码不允许为空，请填写验证码",this.getValidateCodeElement());
               return false;
           }

           /*
           执行登录操作
            */
           http.Post(this._options.url).params(params).success(function(resp){
                if(http.ValidateResp.success(resp)){
                    utils.changeUrl(this._options.successUrl);
                }else{
                    this._options.hint(resp.status,this.getLoginNameElement())
                }
           }).error(function(){
                this._options.hint("请求服务器失败，请检查网络是否连接，或者联系客服解决问题",this.getLoginNameElement());
           }).go();
       })
    }

    return new Login();
})
