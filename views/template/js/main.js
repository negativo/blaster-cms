(function(){
	
	//BlogNameSpace
	var app = {
		init: function(){
			app.events();
			app.ui.init();
		},
		ui:{
			init:function(){
				app.ui.commons();
				app.ui.date();
			},
			commons:function(){
				var $footer = $(".main-footer");
				if ($("body").height() <= 1000 ){
					$footer.css({
						"position":"fixed",
						"bottom":"0px"
					});
				}
			},
			date:function(){
				$( ".date" ).each(function( index ) {
					$(this).text(moment($( this ).text(), "YYYYMMDDHH").fromNow());
				});
			}
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