(function($, window, document, undefined){
	
	var module = {
		init:function(){
			console.log("dummy.js :5", "module up");
			this.ui();
			this.bindEvents();
		},
		ui:function(){

		},
		bindEvents:function(){

		},
	}

	$(document).ready(function(){
		module.init();
	});

	return module;

})(jQuery, this, document);



