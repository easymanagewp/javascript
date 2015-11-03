require(['login'],function(login){
	login.init({
		url : "http://www.baidu1.com",                                                               /* 登录地址 */
        loginNameKey : "userName"                                         /* 用户名提交的key*/
	});
})