define('http',function(){
	
	var	Ajax = function(url){
		this._url = url;
		this._params = {};
		this._success = function(){};
		this._error = function(){};
		this._method = 'GET';
		this._async = true;
	};
	
	Ajax.prototype.params = function(key,value){
		if(arguments.length == 1 && typeof(key) == 'object'){
			this._params = $.extend(this._params,key);
		}else if(typeof(key) == 'string' && typeof(value) == 'string'){
			this.params({
				key : value
			});
		}
		return this;
	}
	
	Ajax.prototype.async = function(async){
		this._async = !!async;
	}
	
	Ajax.prototype.success = function(successCall){
		this._success = successCall;
		return this;
	}
	
	Ajax.prototype.error = function(errorCall){
		this._error = errorCall;
		return this;
	}
	
	Ajax.prototype.go = function(){
		var ajax = this;
		$.ajax(ajax._url,{
			type : ajax._method,
			data : ajax._params,
			dataType : 'json',
			async : ajax._async,
			error : ajax._error,
			success : ajax._success
		})
		return this;
	}
	
	Ajax.prototype.method = function(method){
		this._method = method;
		return this;
	}
	
	
	var Get = function(url){this._url = url;};
	Get.prototype = new Ajax().method('GET');
	
	var Post = function(url){this._url = url;}
	Post.prototype = new Ajax().method('POST');
	
	var Put = function(url){this._url = url;}
	Put.prototype = new Ajax().method('POST').params('_method','put');
	
	var Delete = function(url){this._url = url;}
	Delete.prototype = new Ajax().method('POST').params('_method','delete');
	
	var Patch = function(url){this._url = url;};
	Patch.prototype = new Ajax().method('PATCH').params('_method','patch');
	
	var Http = {
			Get : function(url){return new Get(url);},
			Post : function(url){return new Post(url);},
			Put : function(url){return new Put(url);},
			Delete : function(url){return new Delete(url);},
			Patch : function(url){return new Patch(url);},
			ValidateResp : {
				success : function(resp){
					return resp.status == 0 ;
				}
			}
	};
	
	return Http;
})