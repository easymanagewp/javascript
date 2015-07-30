/* 创建Form对象，初始化target和inputs，如果oOptions存在，那么将对表单进行初始化 */
var Form = function(sSelector,oOptions){
	this.target = $(sSelector);
	this.inputs = {};

	var _arrInputs = this.target.find(':input[name]');
	for(var iIndex = 0;iIndex<_arrInputs.length; iIndex++){
		var _oInput = $(this);
		var _sInputName = _oInput.attr('name');
		this.inputs[_sInputName] = _oInput;
	}
	
	if(oOptions){
		this.init(oOptions);
	}
}

/* 

初始化form表单 
{
	url : '',									// 表单提交地址
	data : 'http://xxx'/{aa:cc},				// 表单数据
	filter : {
		beforeLoad : function(oParams){},		// 加载数据之前执行
		afterLoad : function(oData){},			// 加载数据之后执行
		beforeSubmit : function(oParams){},		// 数据提交之前执行
		afterSubmit : function(err,oData){}		// 数据提交之后执行
	},
	validate : function(){						// 数据验证
		
	}
}
*/
Form.prototype.init = function(oOptions){
	var _target = this.target;

	/* 如果url和method不存在，则从表单属性获取 */
	if(!oOptions.url){oOptions.url = _target.attr('action');}
	if(!oOptions.method){oOptions.method = _target.attr('method');}

	var _defaultOptions = {
		'url' : null,
		'method' : 'post',
		'data' : null,
		'filter' : {
			'beforeLoad' : function(oParams){return oParams;},
			'afterLoad' : function(resp){return resp;},
			'beforeSubmit' : function(oParams){return oParams;},
			'afterSubmit' : function(err,resp){if(err){/* 提交失败*/}else{return resp;}}
		},
		'validate' : function(oParams){return true;}
	}
	oOptions = $.extend(true,{},_defaultOptions,oOptions);
	this.options = oOptions;

	// 如果初始化数据存在，则加载数据
	if(oOptions.data){
		this.data(oOptions.data);
	}

	// 绑定提交事件
	_target.unbind('submit');
	_target.bind('submit',function(){
		var params = this.data();
		var validated = oOptions.validate(params);
		if(validated){
			params = oOptions.filter.beforeSubmit(params);
			$.ajax({
				url : oOptions.url,
				type : oOptions.method,
				dataType : 'json',
				data : params,
				error : function(err){
					oOptions.filter.afterSubmit(err);
				},
				success : function(resp){
					oOptions.filter.afterSubmit(null,resp);
				}
			})
		}
		return false;
	});

	
}

/*
 加载表单数据
*/
Form.prototype.data = function(oData){

	// 参数存在，加载数据
	if(oData){
		if(typeof(oData)=='string'){
			// 远程加载数据
			var _params = {};
			_params = this.options.filter.beforeLoad(_params);
			$.getJSON(oData,_params,function(resp){
				resp = this.options.filter.afterLoad(resp);
				this.data(resp);
			});
		}else{
			// 获取对象类型数据
			this.target.find(":input").each(function(){
				var name = $(this).attr("name");
				if(null != name && '' != name){
					var nameArr = name.split(".");
					var value = oData;
					for(var iIndex = 0;iIndex<nameArr.length;iIndex++){
						 value = value[nameArr[iIndex]];
						 if(value==null){
							 break;
						 }
					}
					if(value!=null){
						if($(this).attr("type")=="radio" || $(this).attr("type")=="checkbox"){
							if($(this).val()==value){
								$(this).attr("checked","checked");
								if(this.onclick){
									this.onclick();
								}
							}
						}else{
							$(this).val(value);
						}
					}
				}
			});
		};
	}

	// 参数不存在，获取数据
	if(!oData){
		var params = {};
		var _element = this.target;
		_element.find(":input").each(function(){
			if(null != $(this).attr("name") && '' != $(this).attr("name")){
				if($(this).attr("type")=="radio" || $(this).attr("type")=="checkbox"){
					if(this.checked){
						if(params[$(this).attr("name")]){
							params[$(this).attr("name")] += "," +$.trim($(this).val());
						}else{
							params[$(this).attr("name")] = $.trim($(this).val());
						}
					}
				}else if($(this).val()!=null && $(this).val()!=""){
					params[$(this).attr("name")] = $.trim($(this).val());
				}
			}
		});
		return params;
	}
};

// 表单清空
Form.prototype.clear = function(){
	this.target.find(':input')  
	 .not(':button, :submit, :reset, :hidden')  
	 .val('')  
	 .removeAttr('checked')  
	 .removeAttr('selected');
}