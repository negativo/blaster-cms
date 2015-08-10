(function(){
	var backend = {
		init:function(){
			backend.ui.init();
			backend.plugins.init();
			backend.events.init();
		},
		ui:{
			init:function(){}
		},
		plugins:{
			init:function(){
				backend.plugins.editor();
			},
			editor:function(){
				new SirTrevor.Editor({ el: $('.js-st-instance'),  blockTypes: ["Text", "Tweet", "Image"] });
			}
		},
		events:{
			init:function(){
				backend.events.savePost();
			},
			savePost:function(){
				$(".post-editor").submit(function(e){
					e.preventDefault();	
					var x = SirTrevor.getInstance(0).store.retrieve();
					console.log("footer.ejs", x);
				});
			}
		}
	}
	backend.init();
})(jQuery)