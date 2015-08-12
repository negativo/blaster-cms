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
				backend.request.editorGetData();
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
			editorGetData:function(){
				$(".editor").submit(function(e){
					e.preventDefault();	
					var contentType = $(".editor").attr("id");
					var title = $(".editor-title").val();
					var body = CKEDITOR.instances.editor1.getData();
					var data = {
						title: title,
						body: body
					}
					console.log("backend.js", contentType);
					if(contentType === "editor-post"){
						$.post("/create/post", data,function(res,status){
							console.log(res);
						});
					} 
					if(contentType === "editor-page"){
						$.post("/create/page", data,function(res,status){
							console.log(res);
						});
					} 
					

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