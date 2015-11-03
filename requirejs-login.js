/**
 * Created by ?? on 2015/8/12.
 * LoginAcion ??ogin??????????????
 */
define(['jquery','utils','http','md5'],function($,utils,http,md5){
    var defaultOptions = {
        url : "",                                                               /* 登录地址 */
        md5 : true,                                                             /* 是否对密码进行md5加密*/
        loginNameKey : "loginName",                                         /* 用户名提交的key*/
        passwordKey : "password",                                           /* 密码提交key*/
        validateCodeKey : "code",                                           /* 验证码提交key*/
        passwordElement : ":input[type='password']",                            /* 密码元素 */
        successUrl : "",                                                             /* 登录成功跳转url */
        hint : function(msg,element){                                               /* 信息提示方式 */
            utils.alert(msg);
            element.focus();
        }
    };

    var Login = function(options){}

    /**
     * ??ʼ??Login?????
     * @param options
     * ??Ϊ????Ϣ????????ֵΪĬ?ֵ
     *  url : "",                                                                ??????ύ???
     * md5 : true,                                                              ????????MD5???
     * loginNameKey : "loginName",                                              ??????ύ??????
     * passwordKey : "password",                                                ???????ύ??????
     *  validateCodeKey : "code",                                               ?֤???ύ??????
     * loginNameElement : ":input[name='"+this.loginNameKey+"']",               ????ҳ?Ԫ?
     * passwordElement : ":input[type='password']",                            ?????ҳ?Ԫ?
     * validateCodeElement : ":input[name='"+this.validateCodeKey+"']",         ?֤?Ԫ?
     * hint : function(nsg,element){                                            ??????ʾ
     *     require(['utils'],function(utils){
     *       utils.alert(msg);
     *       element.focus()
     *     }
    *   }
     */
    Login.prototype.init = function(options){
      var _login = this;
        this._options = $.extend({},defaultOptions,options);
        $('form').on('submit',function(){
          _login.action();
          return false;
        })
    }

    /**
     * ???????
     * @returns ????д??û?????
     */
    Login.prototype.getLoginName = function(){
        return this.getLoginNameElement().val();
    }

    /**
     * ???????Ԫ?
     * @returns ????Ԫ?
     */
    Login.prototype.getLoginNameElement = function(){
        return $(":input[name='"+this._options.loginNameKey+"']");
    }

    /**
     * ???????û???
     * @returns ????д????
     */
    Login.prototype.getPassword = function(){
        return this.getPasswordElement().val();
    }

    /**
     * ????????HtmlԪ?
     * @returns ?????HtmlԪ?
     */
    Login.prototype.getPasswordElement = function(){
        return $(this._options.passwordElement);
    }



    /**
     * ?????????????
     * @returns ????д?????
     */
    Login.prototype.getValidateCode = function(){
        return this.getValidateCodeElement().val();
    }

    /**
     * ???????֤?htmlԪ?
     * @returns ????֤?htmlԪ?
     */
    Login.prototype.getValidateCodeElement = function(){
        return $(":input[name='"+this._options.validateCodeKey+"']");
    }

    /**
     * ִ???????
     */
    Login.prototype.action = function(){
       /*
       ???????Ϣ
        */
       var params = {};
       params[this._options.loginNameKey] = this.getLoginName();
       params[this._options.validateCodeKey] = this.getValidateCode();
       if(this._options.md5 && utils.strNotBlankOrNull(this.getPassword())){
           params[this._options.passwordKey] = md5(this.getPassword());
       }else{
           params[this._options.passwordKey] = this.getPassword();
       }

       /*
       ?֤????Ϣ
        */
       if(utils.strIsBlankOrNull(params[this._options.loginNameKey])){
           this._options.hint("用户名不能为空",this.getLoginNameElement());
           return false;
       }

       if(utils.strIsBlankOrNull(params[this._options.passwordKey])){
           this._options.hint("登录密码不能为空",this.getPasswordElement());
           return false;
       }

       if(utils.strIsBlankOrNull(params[this._options.validateCodeKey])){
           this._options.hint("请填写验证码",this.getValidateCodeElement());
           return false;
       }

       /*
       ִ???????
        */
       http.Post(this._options.url).params(params).success(function(resp){
            if(http.ValidateResp.success(resp)){
                utils.next(this._options.successUrl);
            }else{
                this._options.hint(resp.status,this.getLoginNameElement())
            }
       }).error(function(){
            this._options.hint("??????ʧ?ܣ???????????ӣ?????ϵ?ͷ?????",this.getLoginNameElement());
       }).go();
    }

    return new Login();
})
