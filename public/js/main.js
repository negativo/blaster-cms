(function(){
	
	//BlogNameSpace
	var app = {
		init: function(){
			app.events();
		},
		events:function(){
			$(".post").click(function(){
				$.post("/blog/post",function(res,status){
					console.log("main.js", res);
				});
			});
		}
	}

	app.init();

})(jQuery)