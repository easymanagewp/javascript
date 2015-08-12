/**
 * Created by ���� on 2015/8/12.
 * LoginAcion ��Login�������з�װ�����
 */
define(function(){
    var defaultOptions = {
        url : "",                                                               /* ��¼�����ύ��ַ */
        md5 : true,                                                             /* �Ƿ���������MD5���� */
        loginNameKey : "loginName",                                         /* �û������ύ�������� */
        passwordKey : "password",                                           /* ��¼������ύ�������� */
        validateCodeKey : "code",                                           /* ��֤����ύ�������� */
        loginNameElement : ":input[name='"+this.loginNameKey+"']",      /* �û���ҳ��Ԫ�� */
        passwordElement : ":input[type='password']",                            /* �û�����ҳ��Ԫ�� */
        validateCodeElement : ":input[name='"+this.validateCodeKey+"']",    /* ��֤��Ԫ�� */
        successUrl : "",                                                             /* ��¼�ɹ���ת·�� */
        hint : function(msg,element){                                               /* ������ʾ */
            require(['requirejs-utils'],function(utils){
                utils.alert(msg);
                element.focus();
            })
        }
    };

    var Login = function(){}

    /**
     * ��ʼ��Login������Ϣ
     * @param options
     * ����Ϊ������Ϣ�����������ֵΪĬ��ֵ
     *  url : "",                                                                ��¼�����ύ��ַ
     * md5 : true,                                                              �Ƿ���������MD5����
     * loginNameKey : "loginName",                                              �û������ύ��������
     * passwordKey : "password",                                                ��¼������ύ��������
     *  validateCodeKey : "code",                                               ��֤����ύ��������
     * loginNameElement : ":input[name='"+this.loginNameKey+"']",               �û���ҳ��Ԫ��
     * passwordElement : ":input[type='password']",                            �û�����ҳ��Ԫ��
     * validateCodeElement : ":input[name='"+this.validateCodeKey+"']",         ��֤��Ԫ��
     * hint : function(nsg,element){                                            ������Ϣ��ʾ
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
     * ��ȡ�û���
     * @returns �û���д���û�������
     */
    Login.prototype.getLoginName = function(){
        return this.getLoginNameElement().val();
    }

    /**
     * ��ȡ�û���Ԫ��
     * @returns �û���Ԫ��
     */
    Login.prototype.getLoginNameElement = function(){
        return $(this._options.loginNameElement);
    }

    /**
     * ��ȡ������û�����
     * @returns �û���д������
     */
    Login.prototype.getPassword = function(){
        return this.getPasswordElement().val();
    }

    /**
     * ��ȡ�û�����HtmlԪ��
     * @returns �û�����HtmlԪ��
     */
    Login.prototype.getPasswordElement = function(){
        return $(this._options.passwordElement);
    }

    /**
     * ��ȡ�û��������֤��
     * @returns �û���д����֤��
     */
    Login.prototype.getValidateCode = function(){
        return this.getValidateCodeElement().val();
    }

    /**
     * ��ȡ�û���֤��htmlԪ��
     * @returns �û���֤��htmlԪ��
     */
    Login.prototype.getValidateCodeElement = function(){
        return $(this._options.validateCodeElement);
    }

    /**
     * ִ�е�¼����
     */
    Login.prototype.action = function(){
       require(['http','md5','requirejs-utils'],function(http,md5,utils){

           /*
           ��ȡ������Ϣ
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
           ��֤������Ϣ
            */
           if(utils.strIsBlankOrNull(params[this._options.loginNameKey])){
               this._options.hint("�û�������Ϊ�գ�����д�û���",this.getLoginNameElement());
               return false;
           }

           if(utils.strIsBlankOrNull(params[this._options.passwordKey])){
               this._options.hint("�û����벻����Ϊ�գ�����д�û�����",this.getPasswordElement());
               return false;
           }

           if(utils.strIsBlankOrNull(params[this._options.validateCodeKey])){
               this._options.hint("��֤�벻����Ϊ�գ�����д��֤��",this.getValidateCodeElement());
               return false;
           }

           /*
           ִ�е�¼����
            */
           http.Post(this._options.url).params(params).success(function(resp){
                if(http.ValidateResp.success(resp)){
                    utils.changeUrl(this._options.successUrl);
                }else{
                    this._options.hint(resp.status,this.getLoginNameElement())
                }
           }).error(function(){
                this._options.hint("���������ʧ�ܣ����������Ƿ����ӣ�������ϵ�ͷ��������",this.getLoginNameElement());
           }).go();
       })
    }

    return new Login();
})
