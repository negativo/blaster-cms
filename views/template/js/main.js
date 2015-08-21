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
				if ($(".site-wrapper").height() <= 500 ){
					$footer.css({
						"margin-top":"100px"
					});
				} else{
					$footer.css("position","static!important");
				}
			},
			date:function(){
				$( ".date" ).each(function( index ) {
					$(this).text(moment($( this ).text()).fromNow());
					$( this ).fadeIn();
				});
			}
		},
		request:{
			init:function(){

			}
		},
		events:function(){
		}
	}

	app.init();
})(jQuery)


