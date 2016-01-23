(function($, window, document, undefined){
	
	var reset = {
		init:function(){
			console.log("dummy.js :5", "reset up");
			this.bindEvents();
		},
		bindEvents:function(){
			$(".reset-withToken-form").submit(reset.resetPasswordCheck);
		},
		resetPasswordCheck:function(e){
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

		},
	};

	$(document).ready(function(){
		reset.init();
	});

	return reset;

})(jQuery, this, document);



