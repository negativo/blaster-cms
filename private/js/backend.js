 (function(){
	var backend = {
		init:function(){
			backend.ui.init();
			backend.request.init();
		},
		ui:{
			init:function(){
				$(".date").hide();
				$( ".date" ).each(function( index ) {
					$(this).text(moment($( this ).text(), "YYYYMMDDHH").fromNow());
					$(".date").show();
				});
			}
		},
		plugins:{
			// pass init function as $.fn so we can call wherever we want it.
			editor:function(){
				CKEDITOR.replace( 'editor1', {
					fullPage: true,
					allowedContent: true
				});
			}
		},
		request:{
			init:function(){
				backend.request.editorGetData();
				backend.request.login();
			},
			login:function(){
				var $bh = $(document).height();
					$bh -= $(".form-container").height();
					$bh /= 2;
					$bh -= 20;
				$("#username").val("Neofrascati");
				$("#password").val("Stratomerder1290");
				$(".form-container").css({
					"margin-top": $bh
				});
				
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
					var id = $(".editor").data("id");
					var body = CKEDITOR.instances.editor1.getData();
					var data = {
						id: id,
						title: title,
						body: body
					}
					console.log("backend.js", data);
					console.log("backend.js", contentType);
					if(contentType === "editor-post" && id === undefined){
						$.post("/create/post", data,function(res,status){
							console.log(res);
						});
					};
					if(contentType === "editor-post" && id ){
						$.post("/admin/edit-post", data,function(res,status){
							console.log(status);
							if (status === "success") window.location.replace("/admin/posts");
						});
					};
					if(contentType === "editor-page" && id === undefined){
						$.post("/create/page", data,function(res,status){
							console.log(res);
						});
					};
					if(contentType === "editor-page" && id ){
						$.post("/admin/edit-page", data,function(res,status){
							console.log(status);
							if (status === "success") window.location.replace("/admin/pages");
						});
					};
					

				});
			}
		}
	}
	backend.init();

	//HELPERS
	$.fn.getData = function(item){
		var i = item;
		console.log("backend.js", i);
		return i;
	}
	//global jquery methods
	$.fn.initEditor = function(){
		return backend.plugins.editor();
	};
})(jQuery)