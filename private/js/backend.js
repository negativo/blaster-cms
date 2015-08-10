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
				CKEDITOR.replace( 'editor1' );
				// new SirTrevor.Editor({ 
				// 	el: $('.js-st-instance'),  
				// 	blockTypes: ["Text", "Image"] ,
				// });
				
			}
		},
		events:{
			init:function(){
				backend.events.savePost();
			},
			savePost:function(){
				$(".post-editor").submit(function(e){
					e.preventDefault();	
					// var x = SirTrevor.getInstance(0).store.retrieve();
					var title = $(".post-title").val();
					var body = CKEDITOR.instances.editor1.getData().trim();
					body = body.replace(/^\s*\n/gm, "") ;
					var data = {
						title: title,
						body: body
					}
					$.post("/create/post", data,function(res,status){
						console.log(res);
					});
					console.log("footer.ejs", body);
				});
			}
		}
	}
	backend.init();
})(jQuery)