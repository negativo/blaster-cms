(function(){
	//BlogNameSpace
	var app = {
		init: function(){
			app.events();
			app.ui.init();
			app.request.init();
		},
		ui:{
			init:function(){
				app.ui.commons();
				app.ui.date();
			},
			commons:function(){
				var $footer = $(".main-footer");
				if ($(".site-wrapper").height() <= 700 ){
					$footer.css({
						"position":"fixed",
						"bottom":"0px"
					});
				} else{
					$footer.css("position","static!important");
				}
			},
			date:function(){
				$( ".date" ).each(function( index ) {
					$(this).text(moment($( this ).text()).fromNow());
				});
			}
		},
		request:{
			init:function(){

			}
		},
		events:function(){
			$(".reply").click(function(){
				$( this ).siblings(".reply-comment").fadeIn();
			})
		}
	}

	app.init();
})(jQuery)


