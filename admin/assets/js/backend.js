(function($, window, document, undefined){
	var backend = {
		init:function(){
			backend.setup();
			backend.bindEvents();
			backend.request.init();
			backend.plugins.init();
		},
		setup:function(){
			/**
			 * AJAX ERROR CATCHER
			 */
			$( document ).ajaxError(function(err, head) {
			  console.log('You are not authorized to do this action!')
			  if(head.status === 403){
			  	toastr.error("Your are not authorized to do this!","Contact the admin!");
			  }else if(head.status === 401){
			  	toastr.error("Unsuccessful authentication","Try again!");
			  }else{
			  	toastr.error("There was an error with your request","Contact the admin");
			  }
			});

			/**
			 * CENTERED FORMS login/resetpwd
			 */
			var $bh = $(window).height();
			$bh -= $(".form-container").height();
			$bh /= 2;
			$bh -= 20;

			$(".form-container").css({
				"margin-top": $bh
			});
			$(".form-container").fadeIn();		

		},
		bindEvents:function(){
			var $uploader = $("#avatarUploaderForm");
			//open search

			$("body").delegate(".upload-file","click",function(){
				$("#media-upload-form").find("input").trigger("click");
			});

		},
		plugins:{
			// pass init function as $.fn so we can call wherever we want it.
			init:function(){
				$body = $("body");
				backend.plugins.momentjs();
				backend.plugins.toastrjs();
				//page/post editor
				if ( $body.find(".editor").length ) backend.plugins.editor();
				// code editor
				if ( $body.attr("class") === "edit-theme" ) backend.plugins.codemirror();
			},
			editor:function(){
				// Loads a plugin from an external URL
				tinymce.PluginManager.load('tinyvision', '/components/tinyvision/build/plugin.min.js');

		    tinymce.init({
		      selector: '#text-editor',
				  height: 500,
				  plugins: [
		        "advlist autolink lists link image imagetools charmap preview anchor",
		        "searchreplace visualblocks code fullscreen",
		        "insertdatetime media table contextmenu paste -tinyvision "
			    ],
			    toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
		    	tinyvision: {
				    source: '/api/file-browser'
				  }
				});
			},
			momentjs:function(){
				$body = $("body");
				$(".date").hide();
				$( ".date" ).each(function( index ) {
					var date = new Date($( this ).text());
					$(this).text(moment( date ).fromNow(true));
					$(".date").show();
				});
			},
			toastrjs:function(){
				toastr.options.closeButton = true;
			},
			codemirror:function(){
				var textarea = document.getElementById('custom-css-area');
				var editor = CodeMirror.fromTextArea(textarea, {
			    	lineNumbers: true,
			    	mode:"css"
			  	});
			 	window.CODE_EDITOR = editor;
			}
		},
		request:{
			init:function(){
				backend.request.editorGetData();
				backend.request.media_upload();
				backend.request.remove_media();
			},
			remove_media: function(){
				var $button = $(".remove-media");

				$button.click(function(e){
					e.preventDefault();
					var $image = $(this).parent().parent();
					var image_id = $(this).next().data("id");

					swal({
						title: "Are you sure?",
						text: "You will not be able to recover this image!",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "Yes, delete it!",
						closeOnConfirm: true 
					}, function(){
						$.ajax({
							url: '/api/media/' + image_id,
							type: 'delete',
							success: function(res){
								if(res === "delete") $image.fadeOut();
							}	
						});
					});

				});
			},
			media_upload:function(){
				var max_filesize = 2 * 1000000; // 2MB

				$('#media-upload-form').submit(function(e) {
					e.preventDefault();
				});

				$('#file-upload').change(function(event) {
					event.preventDefault();
					event.stopPropagation();
					
					var form = new FormData();

					$button = $("body").find('.upload-file');

					$button.html('<i class="fa fa-cog fa-spin"></i>');

					var files = [];
					var files = $("#media-upload-form").find("input")[0].files;

					for (var i = 0; i < files.length; i++) {
						if(files[i].size <= max_filesize){
							form.append('upload', files[i]);
						}else{
							toastr.error("File too big (max "+ max_filesize+"):<br>" + files[i].name);
						}
					};

					$.ajax({
						url: '/api/upload',
						type: 'POST',
						cache:false,
						processData: false,
    				contentType: false,
						data: form,
						success: function(res){
							$button.html('<i class="fa fa-upload"></i>');
							toastr.success("Media Uploaded");
							console.log("backend.js :112", res);
							$('#media-upload-form')[0].reset();
							setTimeout(function(){
										window.location.reload();
							},1000);	
						}
					});
					
				});
			},
			editorGetData:function(){				
				$(".tags-input").click(function(){
					$(".tags-input").val().split(",")
				});
				$(".editor").submit(function(e){
					e.preventDefault();	
					tinyMCE.triggerSave();

					var contentType = $(".editor").attr("id"),
							template = $("#templates-choice").val() || "page-template",
							data = {
								id: $(".editor").data("id"),
								title: $(".editor-title").val(),
								body: $("#text-editor").val(),
								template:template,
								tags: []
							};
					
					console.log("backend.js :390", contentType);
					console.log("backend.js :389", data);

					if(data.title == ""){
						//DO SOME VALIDATION LATER
						data.title = "My New Content";
					}

					// is a post and is new
					if(contentType === "editor-post" && data.id === ""){
						data.tags = $(".tags-input").val().split(",");
						$.post("/api/post", data,function(res,status){
							console.log(res);
							if (status === "success") {
								toastr.success("Post created!");
								setTimeout(function() { window.location.replace("/admin/posts"); }, 1000);
							}
						});
					};

					// is a post and is existing
					if(contentType === "editor-post" && data.id !== "" ){
						data.tags = $(".tags-input").val().split(",");
						$.post("/api/post/" + data.id , data,function(res,status){
							console.log(status);
							if (status === "success") {
								toastr.success("Post edited!");
								setTimeout(function() { window.location.replace("/admin/posts"); }, 1000);
							}
						});
					};

					// is a page and is new
					if(contentType === "editor-page" && data.id === ""){
						data.tags = [];
						$.post("/api/page", data,function(res,status){
							console.log(res);
							if (status === "success") {
								toastr.success("Page created!");
								setTimeout(function() { window.location.replace("/admin/pages"); }, 1000);
							}
						});
					};

					// is a page and is existing
					if(contentType === "editor-page" && data.id !== "" ){
						data.tags = [];
						$.post("/api/page/" + data.id, data, function(res,status){
							console.log(status);
							if (status === "success") {
								toastr.success("Page edited!");
								setTimeout(function() { window.location.replace("/admin/pages"); }, 1000);
							}
						});
					};
					
				});
			},
		}
	}

	/**
	 * HELPERS
	 */	
	window.pageReload = function(){
		return setTimeout(function(){ window.location.reload(); }, 1500);
	}

	$(document).ready(function(){
		backend.init();
	});
})(jQuery, this, document);
