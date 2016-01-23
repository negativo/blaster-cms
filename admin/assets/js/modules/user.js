(function($, window, document, undefined){
	
	var user = {
		init:function(){
			console.log("dummy.js :5", "user up");
			this.captcha();
			this.bindEvents();
		},
		captcha:function(){
			var $capthacQuestion = $("#captcha-q");
			var sum = randomize();
			$capthacQuestion.html(sum[0] +"+"+ sum[1]);
		},
		bindEvents:function(){
			$('#user-token-api-request').submit(user.requestApiToken);
			$("#user-profile-form").submit(user.changeInfo);
			$("#user-profile-pwd").submit(user.changePassword);

		  //when file chose trigger upload
			$("#avatar-uploader").on("change",function(){
				$("#avatar-submit").trigger("click");
			});

			$("body").delegate(".avatar-container","click",function(){
				$("body").find("#avatar-uploader").trigger("click");
			});

			$('body').find(".register-form").submit(user.register);

			$('body').on('click', ".delete-user", user.deleteUser);
		},
		deleteUser:function(e){
			e.preventDefault();
			e.stopPropagation();

			var $that;
			var $user = { 
					id: "", 
					deleteUserData: false,
				};


			$user.id = $(this).data("id");
			$that = $(this);

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
		},
		register:function(e){
			e.preventDefault();
			var $capthacQuestion = $("#captcha-q"),
			$capthacAnswer       = $("#captcha-a"),
			$username            = $(".register-username"),
			$password            = $(".register-retype"),
			$retype              = $(".register-password");
			


			if( Number($capthacAnswer.val()) === Number(eval($capthacQuestion.html())) && $password.val() === $retype.val() ){
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
				if( Number($capthacAnswer.val()) !== Number(eval($capthacQuestion.html())) ) toastr.error("Wrong captcha!");
				if( $password.val() !== $retype.val() ) toastr.error("Password Missmatch!");
				user.captcha();
			}

		},
		changePassword:function(e){
			e.preventDefault();
			
			$(".pwd-err").removeClass("alert success");
			$(".pwd-err").hide();

			var pwd ={ 
				id: $(".profile-container").data("id"),
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
							window.location.reload();
						},1500);
					}else if(res !== "success"){
						$(".pwd-err").fadeIn().addClass("alert").text(res.message);
					}
				});						
			}
		},
		changeInfo:function(e){
			e.preventDefault();
			var profile = {
				id: $(".profile-container").data("id"),
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
		},
		requestApiToken: function(e){
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
					});
				});//swal

			},
	}

	
	function randomize(){
		var	x = Math.floor(Math.round(Math.random()*10)),
			y = Math.floor(Math.round(Math.random()*10)),
			res = x +y;
		return [x,y,res];
	};


	$(document).ready(function(){
		user.init();
	});

	return user;
	
})(jQuery, this, document);