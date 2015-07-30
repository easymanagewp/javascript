(function(global){
	function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }
	
	function scripts(){
		return document.getElementsByTagName('script');
	}
	
	each(scripts(),function(script){
		global.basePath = script.getAttribute('data-basePath');
	})
	
})(this);
