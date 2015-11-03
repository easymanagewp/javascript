/**
 * Created by 王鹏 on 2015/8/12.
 * 工具类
 */
define(['jquery'],function($){
    return {
        next : function(url){
            window.location.href = url;
        },
        alert : function(msg){
            alert(msg);
        },
        strNotBlankOrNull : function(str){
            return (null != str && "" != str);
        },
        strIsBlankOrNull : function(str){
            return !this.strNotBlankOrNull(str);
        }
    };
})
