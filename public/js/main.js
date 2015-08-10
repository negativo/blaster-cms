(function(){
	
	//BlogNameSpace
	var app = {
		init: function(){
			app.events();
		},
		events:function(){
			$(".post").click(function(){
				$.post("/create/post",function(res,status){
					console.log("main.js postcreate", res);
				});
			});
			$(".page").click(function(){
				$.post("/create/page",function(res,status){
					console.log("main.js pagecreate", res);
				});
			});
		}
	}

	app.init();

})(jQuery)