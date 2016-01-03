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
				backend.ui.bindEvent();
			},
			sidebar:function(){
				// $(".side-nav").find("li").click(function(){
				// 	console.log("backend.js :14", $(this));
				// });
			},
			bindEvent:function(){
				var $uploader = $("avatarUploaderForm");
				//open search
				$("body").delegate(".avatar-container","click",function(){
					$("body").find("#avatar-uploader").trigger("click");
				});
				//when file chose trigger upload
				$("#avatar-uploader").on("change",function(){
					$("#avatar-submit").trigger("click");
				})
			}	
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
				$body = $("body");
				$body.find(".editor").hide();
				CKEDITOR.replace( 'editor1', {
					fullPage: true,
					allowedContent: true,
					    filebrowserBrowseUrl: '/admin/file-browser',
    					filebrowserUploadUrl: '/api/upload'
				});
				$body.find(".editor").show();
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
				backend.request.editorGetData();
				backend.request.login();
				backend.request.settings();
				backend.request.navigation();
				backend.request.profile();
				backend.request.avatar();
				backend.request.editComment();
				backend.request.custom_css();
				backend.request.chooseTheme();
				backend.request.register();
				backend.request.deleteUser();
				backend.request.search();
			},
			search:function(){

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
				
				// $(".login-form").submit(function(e){
				// 	e.preventDefault();
				// 	var data = {
				// 		username: $("#username").val().trim(),
				// 		password: $("#password").val().trim()
				// 	};
				// 	$.post("/admin/login", data, function(err, res){
				// 		console.log("backend.js", res);
				// 		if( res.err ) console.log("backend.js", res.err);
				// 		if( !res.err ) window.location.replace("/admin/panel");
				// 	});
				// });
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
							$.post("/api/user", data, function(res){
								console.log("backend.js :119", res);
								if (res.message){
									toastr.success(res.message);
									setTimeout(function(){
										window.location.replace("/admin/users");
									},2000);									
								} else if (res.err){
									toastr.error(res.err);
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
								window.location.replace("/admin/panel");
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
				$(".delete-user").click(function(){
					if(confirm( $(this).data("username") + " will be deleted and can't be restored, are you sure?")){
						var $that = $(this);
						var $user = { id: $that.data("id") };
						$.ajax({
					    url: '/api/user/' + $user.id,
					    type: 'DELETE',
					    data: $user,
					    success: function(res) {
								if (!res.err) {
									$that.parent().parent().slideUp();
									toastr.success(res.message);
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
					$socialsContainer.append('<div class="form-group"><label for="text" contenteditable>Edit this</label><input type="text" class="form-control social-link"></div>');
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
						setTimeout(function(){ window.location.replace("/admin/navigation"); }, 2000)
						
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
					e.preventDefault();	
					var contentType = $(".editor").attr("id");
					var title = $(".editor-title").val();
					var id = $(".editor").data("id");
					var body = CKEDITOR.instances.editor1.getData();
					var template = $("#templates-choice").val() || "page-template";
					var data = {
						id: id,
						title: title,
						body: body,
						template:template,
						tags: []
					}
					console.log("backend.js", data);
					console.log("backend.js", contentType);
					if(data.title == ""){
						//DO SOME VALIDATION LATER
						data.title = "My New Content";
					}
					if(contentType === "editor-post" && id === undefined){
						data.tags = $(".tags-input").val().split(",");
						$.post("/api/post", data,function(res,status){
							console.log(res);
							if (status === "success") {
								toastr.success("Post created!");
								setTimeout(function() { window.location.replace("/admin/posts"); }, 1000);
							}
						});
					};
					if(contentType === "editor-post" && id ){
						data.tags = $(".tags-input").val().split(",");
						$.post("/api/post/" + data.id , data,function(res,status){
							console.log(status);
							if (status === "success") {
								toastr.success("Post edited!");
								setTimeout(function() { window.location.replace("/admin/posts"); }, 1000);
							}
						});
					};
					if(contentType === "editor-page" && id === undefined){
						data.tags = [];
						$.post("/api/page", data,function(res,status){
							console.log(res);
							if (status === "success") {
								toastr.success("Page created!");
								setTimeout(function() { window.location.replace("/admin/pages"); }, 1000);
							}
						});
					};
					if(contentType === "editor-page" && id ){
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
					if (confirm("Deleted comment can't be restored are you sure? ") ){
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
					};
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

	//HELPERS
	$.fn.getData = function(item){
		var i = item;
		console.log("backend.js", i);
		return i;
	}
})(jQuery,window,document)