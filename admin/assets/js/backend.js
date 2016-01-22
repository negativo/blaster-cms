(function(){
	var backend = {
		init:function(){
			backend.ui.init();
			backend.request.init();
			backend.plugins.init();
		},
		ui:{
			init:function(){
				backend.ui.sidebar();
				backend.ui.login();
				backend.ui.bindEvent();
			},
			sidebar:function(){
			},
			login:function(){
				var $bh = $(window).height();
				$bh -= $(".form-container").height();
				$bh /= 2;
				$bh -= 20;

				$(".form-container").css({
					"margin-top": $bh
				});
				$(".form-container").fadeIn();		
			},
			bindEvent:function(){
				var $uploader = $("avatarUploaderForm");
				//open search
				$("body").delegate(".avatar-container","click",function(){
					$("body").find("#avatar-uploader").trigger("click");
				});

				$("body").delegate(".upload-file","click",function(){
					$("#media-upload-form").find("input").trigger("click");
				});

				//when file chose trigger upload
				$("#avatar-uploader").on("change",function(){
					$("#avatar-submit").trigger("click");
				});

			},
		},
		plugins:{
			// pass init function as $.fn so we can call wherever we want it.
			init:function(){
				$body = $("body");
				backend.plugins.momentjs();
				backend.plugins.toastrjs();
				backend.plugins.croppicjs();
				//page/post editor
				if ( $body.find(".editor").length ) backend.plugins.editor();
				// code editor
				if ( $body.attr("class") === "edit-theme" ) backend.plugins.codemirror();
			},
			editor:function(){
		    tinymce.init({
		      selector: '#text-editor',
				  height: 500,
				  plugins: [
		        "advlist autolink lists link image imagetools charmap preview anchor",
		        "searchreplace visualblocks code fullscreen",
		        "insertdatetime media table contextmenu paste "
			    ],
			    toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
		    	
				});
			},
			momentjs:function(){
				$body = $("body");
				$(".date").hide();
				$( ".date" ).each(function( index ) {
					$(this).text(moment($( this ).text()).fromNow());
					$(".date").show();
				});
			},
			toastrjs:function(){
				toastr.options.closeButton = true;
				//toastr.options.progressBar = true;
			},
			croppicjs:function(){
				// var cropperOptions = {
				// 	uploadUrl:'/'
				// }		
				// var cropperHeader = new Croppic('changeAvatar');
			},
			codemirror:function(){
				var textarea = document.getElementById('custom-css-area');
				var editor = CodeMirror.fromTextArea(textarea, {
			    	lineNumbers: true,
			    	mode:"css"
			  	});
			 	CODE_EDITOR = editor;
			}
		},
		request:{
			init:function(){
				backend.request.setup();
				backend.request.editorGetData();
				backend.request.settings();
				backend.request.navigation();
				backend.request.profile();
				backend.request.avatar();
				backend.request.editComment();
				backend.request.custom_css();
				backend.request.chooseTheme();
				backend.request.register();
				backend.request.deleteUser();
				backend.request.media_upload();
				backend.request.remove_media();
				backend.request.forgotten_password();
				backend.request.resetPasswordWithToken();
				backend.request.request_api_token();
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
			},
			request_api_token: function(){
				$('#user-token-api-request').submit(function(e){
					e.preventDefault();
					e.stopPropagation();
					var $form = $(this);
					var $input = $(this).find("input[type='text']");

					swal({   
						title: "Authenticate!",   
						text: "Type the user's password",   
						type: "input",
						inputType: 'password',
						showCancelButton: true,   
						closeOnConfirm: false,   
						animation: "slide-from-top",   
						inputPlaceholder: "Write something" 
					}, function(inputValue){   
						if (inputValue === false) return false;      
						if (inputValue === "") {     
							swal.showInputError("You need to write something!");     
							return false;
						}      
						
						$.ajax({
							url: '/api/token/generate',
							type: 'POST',
							data: { user_id: $form.data('id'), password: inputValue },
							success:function(res, head){
								console.log("backend.js :156", res);
								$input.val(res.token);
								$form.find('button').fadeOut();
								swal("Token generated", null, "success"); 
							},
							error:function(head){
								if(head.status === 401 ){
									swal("Wrong password!", "Wrong authentication data, try again", "error"); 
								}
								if(head.status === 405 ){
									swal("User have a token", "User have a token yet!", "error"); 
								}
								if(head.status === 403 ){
									swal("Not Authorized!", null, "error"); 
								}
							}
						})
						

						//swal("Nice!", "You wrote: " + inputValue, "success"); 
					});

				});
			},
			forgotten_password:function(){
				// using flash message for now
				//$form = $("#reset-password-form");
			},
			resetPasswordWithToken: function(){
				$(".reset-withToken-form").submit(function(e){
					$("#messages").addClass('hide');
					e.preventDefault();
					e.stopPropagation();

					var min_pwd_lng = 6;

					var pwd = $(this).find('.change-password').val();
					var retype_pwd = $(this).find('.retype-password').val();

					if(pwd === retype_pwd){
						if(pwd.length >= min_pwd_lng){
							$.ajax({
								url: '/api/user/reset/token',
								type: 'POST',
								data: { password: pwd, mail: $("input[name='_mail']").val(), token: $("input[name='_token']").val() },
								success: function(res){
									if(!res.message) $("body").find('#messages').html(res.err);
									$("form").fadeOut();
									$("body").find('#messages').html(res.message).removeClass('hide');
								}
							});
						}else{
							$("body").find('#messages').html('Password too short, it should be greater than 6 character').removeClass('hide');	
						}
					}else{
						$("body").find('#messages').html('Password mismatch! Try again!').removeClass('hide');
					}
					
				});
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
			register:function(){
				var capthacQuestion = $("#captcha-q"),
					capthacAnswer = $("#captcha-a"),
					$form = $(".register-form"),
					$username = $(".register-username"),
					$password = $(".register-retype"),
					$retype = $(".register-password");
					// CAPTCHA
					function randomize(){
						var	x = Math.floor(Math.round(Math.random()*10)),
							y = Math.floor(Math.round(Math.random()*10)),
							res = x +y;
						capthacQuestion.html(x +"+"+ y);
						return [x,y,res];
					};
					var sum = randomize();
					$form.submit(function(e){
						e.preventDefault();
						if( Number(capthacAnswer.val()) === sum[2] && $password.val() === $retype.val() ){
							var data = {
								username:$(".register-username").val(),
								password:$(".register-password").val()
							}
							$.ajax({
								url: '/api/user',
								type: 'POST',
								data: data,
								success:function(res){
									console.log("backend.js :320", res);
									if (res.message){
										toastr.success(res.message);
										setTimeout(function(){
											window.location.replace("/admin/users");
										},2000);									
									} else if (res.err){
										toastr.error(res.err);
									}
								}
							});
							
						}else{
							if( Number(capthacAnswer.val()) !== sum[2] ) toastr.error("Wrong captcha!");
							if( $password.val() !== $retype.val() ) toastr.error("Password Missmatch!");
							sum = randomize();
						}
					});
			},
			profile:function(){
				var $profilePwdForm = $("#user-profile-pwd"),
					$profileForm = $("#user-profile-form"),
					$profileId = $(".profile-container").data("id");

				//CHANGE PROFILE INFO
				$profileForm.submit(function(e){
					e.preventDefault();
					var profile = {
						id: $profileId,
						username: $("#profile-username").val(),
						name: $("#profile-full-name").val(),
						email: $("#profile-email").val(),
						role: $("#profile-role").val()
					}
					$.post("/api/user/" + profile.id , profile, function(res,status){
						console.log("backend.js :90", res);
						if (res === "success") {
							toastr.success('Profile Changed!');
							setTimeout(function(){
								window.location.reload();
							},2000);
						} else{
							toastr.error('Error while changing profile');
						}
					});
				});	

				//CHANGE PASSWORD
				$profilePwdForm.submit(function(e){
					e.preventDefault();
					$(".pwd-err").removeClass("alert success");
					$(".pwd-err").hide();
					var pwd ={ 
						id: $profileId,
						oldPwd: $(".profile-old-pwd").val().trim(),
						newPwd: $(".profile-new-pwd").val().trim(),
						checkPwd: $(".profile-check-pwd").val().trim()
					};

					//validation then change it.
					if(pwd.oldPwd === "" || pwd.newPwd === "" || pwd.checkPwd === "" ){
						$(".pwd-err").fadeIn().addClass("alert").text("Can't be empty!");
					} else if ( pwd.newPwd === pwd.oldPwd ) {
						$(".pwd-err").fadeIn().addClass("alert").text("Choose a new password!");
					} else if ( pwd.newPwd !== pwd.checkPwd ) {
						$(".pwd-err").fadeIn().addClass("alert").text("Passwords don't match!");
					} else{
						$.post("/api/user/"+ pwd.id +"/password" ,pwd ,function(res,status){
							console.log("backend.js :80", res);
							if(!res.err){
								$(".pwd-err").fadeIn().addClass("success").text(res.message + ", redirecting to login.");
								toastr.success('Password changed!', 'Redirecting to login')
								setTimeout(function(){
									window.location.replace("/admin/panel");
								},2500);
							}else if(res !== "success"){
								$(".pwd-err").fadeIn().addClass("alert").text(res.message);
							}
						});						
					}

				});
			},
			deleteUser:function(){
				var $user = { 
					id: "", 
					deleteUserData: false,
				};

				var $that;

				$(".delete-user").click(function(e){
					$user.id = $(this).data("id");
					$that = $(this);

					e.preventDefault();
					swal({   
						title: "Are you sure?",   
						text: "You will not be able to recover user: " + $(this).data("username"),   
						type: "warning",
						showCancelButton: true,   
						confirmButtonColor: "#DD6B55",   
						confirmButtonText: "Yes, delete it!",   
						closeOnConfirm: false 
					}, function(){   
							swal({   
								title: "What about data?",   
							text: "Would you give ownership of post/media/pages to the administrator?",   
							type: "warning",   
							showCancelButton: true,   
							confirmButtonColor: "#DD6B55",   
							confirmButtonText: "Yes, give to admin!",
							cancelButtonText: "No, delete all!",
							closeOnConfirm: true,   
							closeOnCancel: true 
						}, function(isConfirm){   
							if (isConfirm) {
								//give data to admin  
								$user.deleteUserData = false;
								deleteUserRequest();
							} else {     
								$user.deleteUserData = true;
								deleteUserRequest();
							} 
						});
					});

					function deleteUserRequest(){
						$.ajax({
					    url: '/api/user/' + $user.id,
					    type: 'DELETE',
					    data: $user,
					    success: function(res) {
								if (!res.err) {
									toastr.success(res.message);
									//redirect if it's not on /users list page
									if( document.location.pathname.match(/\/admin\/users\/[A-Za-z0-9].+/) ){
										window.location.replace("/admin/users");
									}else{
										$that.parent().parent().slideUp();
									}

								}else{
									return toastr.error(res.err);
								}
					    }
						});
					}
					
				});
			},
			avatar:function(){
			},
			settings:function(){
				var $addLink = $(".add-social-link"),
					$settingsForm = $("#settings-form")
					$socialsContainer = $(".social-link-container"),
					$socialLink = $(".social-link"),
					getLinks = [];

				$(".remove-sopcial-link").click(function(e){
					e.preventDefault();	
					$(this).parent().remove();
				});	

				$addLink.click(function(e){
					$socialsContainer.append('<div class="form-group"><label for="text" contenteditable>Edit this label to the social name</label><input type="text" class="form-control social-link" placeholder="Social Link"></div>');
				});

				$settingsForm.submit(function(e){
					e.preventDefault();
					$socialsContainer.find(".social-link").each(function(i){
						var social = {
							website: $(this).prev().text().trim(),
							link: $(this).val().trim()
						}
						getLinks.push(social);
						console.log("backend.js", getLinks);
					});
					var settings = {
						siteTitle: $("#site-title").val().trim(),
						subtitle: $("#site-subtitle").val().trim(),
						home: $("#homepage").val(),
						links: getLinks
					};

					console.log("backend.js :279", settings);
					console.log("backend.js", settings );
					$.post("/api/configuration", settings ,function(res,status){
						console.log("backend.js", res);
						getLinks = [];
						if (res === "success") {
							toastr.success('Configurations Changed!');
							//setTimeout(function(){ window.location.replace("/admin/login"); }, 1500);
						}
						//window.location.replace("configurations");
					});
				});
			},
			navigation:function(){
				var $addLink = $(".add-navigation-link"),
					$navigationForm = $("#navigation-form")
					$navigationsContainer = $(".navigation-link-container"),
					$navigationLink = $(".navigation-link"),
					$exPageWrap = $(".add-pages-container"),
					getNavigation = { links:[] };
				

				$(".add-page-to-nav").click(function(e){
					e.preventDefault();
					var existings = {
						slug: $(this).parent().data("slug"),
						title: $(this).parent().data("title")
					};
					$navigationsContainer
						.append('<div class="form-group"><label for="text" contenteditable>'+ existings.title +'</label><input type="text" class="form-control navigation-link" placeholder="'+ existings.title +'" value="'+ existings.slug +'"><i class="fa fa-fw fa-remove remove-page-from-nav"></i></div>');
				});

				$(".remove-page-from-nav").click(function(e){
					e.preventDefault();	
					$(this).parent().remove();
					$("#navigation-form").submit();
				});				

				$addLink.click(function(e){
					$navigationsContainer.append('<div class="form-group"><label for="text" contenteditable>Edit Nav Name</label><input type="text" class="form-control navigation-link" placeholder="URL"></div>');
				});		
				$navigationForm.submit(function(e){
					e.preventDefault();
					$navigationsContainer.find(".navigation-link").each(function(i){
						var navigation = {
							linkName: $(this).prev().text().trim(),
							link: $(this).val().trim(),
							display:true
						}
						getNavigation.links.push(navigation);
						//console.log("backend.js", getNavigation);
					});
					console.log("backend.js", getNavigation );
					$.post("/api/navigation", getNavigation ,function(res,status){
						console.log("backend.js", res);
						getNavigation.links = [];
						toastr.success('Navigation Changed!');
						console.log("backend.js :218", res);
						pageReload();
					});

				});		
			},
			custom_css:function(){
				var $form = $("#custom-css-form"),
					$css = $(".custom-css");

				$form.submit(function(e){
					e.preventDefault();
					var editor = CODE_EDITOR;					
					var data = { css: editor.getValue() };
					$.post("/api/custom-css", data, function(res,status){
						if (res === "success") toastr.success("Custom CSS updated!");
					});
				});

			},
			chooseTheme:function(){
				var $form = $("#themes-form");
				$form.submit(function(e){
					e.preventDefault();
					var data = {
						theme: $("#avaible-themes").val()
					}
					$.post("/admin/themes", data, function(res){
						if(res === "success") {
							toastr.success("Reload!","Theme changed");
							setTimeout(function(){ window.location.replace("/"); }, 1500)
						}
					});
				});
			},
			editorGetData:function(){				
				$(".tags-input").click(function(){
					$(".tags-input").val().split(",")
				});
				$(".editor").submit(function(e){
					var isPost = function(data){
						if(contentType === "editor-post") return true;
						else return false;
					}
					var isPage = function(data){
						if(contentType === "editor-page") return true;
						else return false;
					}
					var isNew = function(data){
						if(data.id === "") return true;
						else return false;
					}

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
			editComment:function(){
				//delete commment
				$(".remove-comment").click(function(){
					var $parent = $( this ).parent().parent();
					var data = { action:"delete", id:$(this).data("id"), post_id: $(this).data("post-id") };
					swal({
						title: "Are you sure?",
						text: "You will not be able to recover this comment!",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "Yes, delete it!",
						closeOnConfirm: true 
					}, function(){
						$.ajax({
							url: "/api/comment/" + data.id,
							type: 'DELETE',
							data: data,
							success:function(res){
								if (res === "success" ) {
									toastr.success("Comment Removed!");
									$parent.slideUp();
								};
							},
						});
					});
				});

				//edit comment
				$(".comment-body").click(function(){
					$(this).parent().find(".save-comment").fadeIn();
				});
				$(".edit-comment").click(function(){
					$( this ).siblings(".save-comment").fadeIn();
					$( this ).parent().parent().find(".comment-body").focus();
				});
				$(".save-comment").click(function(){
					var $parent = $( this ).parent().parent(),
						$comment = $parent.find(".comment-body");
					var data = { action:"update", id:$comment.data("id").trim(), body: $comment.text() };
					$.post("/api/comment/" + data.id, data, function(res){
						if (res === "success" ) toastr.success("Comment edited!");
					});
				});
			}
		}
	}
	backend.init();

	/**
	 * [getData description]
	 */
	
	var pageReload = function(){
		return setTimeout(function(){ window.location.reload(); }, 1500);
	}

	$.fn.getData = function(item){
		var i = item;
		console.log("backend.js", i);
		return i;
	}
})(jQuery,window,document)