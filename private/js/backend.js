(function(){
	var backend = {
		init:function(){
			backend.ui.init();
			backend.request.init();
		},
		ui:{
			init:function(){}
		},
		plugins:{
			// pass init function as $.fn so we can call wherever we want it.
			editor:function(){
				CKEDITOR.replace( 'editor1' );
			}
		},
		request:{
			init:function(){
				backend.request.savePost();
				backend.request.login();
			},
			login:function(){
				$(".login-form").submit(function(e){
					e.preventDefault();
					var data = {
						username: $("#username").val().trim(),
						password: $("#password").val().trim()
					};
					$.post("/admin/login", data, function(err, res){
						console.log("backend.js", res);
						if( res.err ) console.log("backend.js", res.err);
						if( !res.err ) window.location.replace("/admin/panel");
					});
				});
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

	//global jquery methods
	$.fn.initEditor = function(){
		return backend.plugins.editor();
	};
})(jQuery)