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
				app.ui.search();
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
			},
			search:function(){
				var $search = $(".search-button"),
					$formContainer = $("body").find("#search-form"),
					$form = $formContainer.find("form"),
					$input = $(".search-term");

				$search.click(function(e){
					e.stopPropagation();
					$form.css("margin-top", ($(window).height() - $form.height())/2 +"px" )
					$formContainer.slideDown(function(){
						$(this).find(".search-term").focus();
					});

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


