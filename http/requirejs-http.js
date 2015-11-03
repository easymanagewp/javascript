define('http',function(){
	
	var	Ajax = function(url){
		this._url = url;
		this._params = {
			/* Ajax 不进行数据缓存 */
			_TIMESTAMP_  : new Date().getTime()
		};
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
	
	var Http = {
			Get : function(url){return new Ajax(url).method('GET');},
			Post : function(url){return new Ajax(url).method('POST');},
			Put : function(url){return new Ajax(url).method('POST').params('_method','put');},
			Delete : function(url){return new new Ajax(url).method('POST').params('_method','delete');},
			Patch : function(url){return new new Ajax(url).method('POST').params('_method','patch');},
			ValidateResp : {
				success : function(resp){
					return resp.status == 0 ;
				}
			}
	};
	
	return Http;
})