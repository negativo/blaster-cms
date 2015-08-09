(function(){
	
	//BlogNameSpace
	var app = {
		init: function(){
			app.installation();
			app.events();
		},
		installation:function(){
			var $formMongo = $(".installation-form-mongo");
			var $form = $(".installation-form-info");
			var $submit = $form.find(".install-submit");
			var $mongoSubmit = $(".mongo-submit");

			$(".mongo-localhost").click(function(e){
				e.preventDefault();
				$formMongo.find(".mongo-link").val("mongodb://localhost:27017");
			});

			$form.hide();
			$mongoSubmit.click(function(e){
				e.preventDefault();
				var data = {
					link: $formMongo.find("input").val()
				}
				$.post("/install/mongo", data, function(data,status){
					console.log(status,data);
					if(data.err === null && data.status === 200){
						$formMongo.fadeOut(500,function(){
							$form.fadeIn();
						});
					} else{
						$formMongo.find(".mongo-err").html(data.err.message).fadeIn();
					}
				});

			});
			$submit.click(function(e){
				e.preventDefault();
				var url = $form.serialize();
				var data = {
					title:$form.find(".blog-title").val(),
					username:$form.find(".user-username").val(),
					password:$form.find(".user-password").val()
				}

				$.post("/install/blog", data, function(response,status){
					console.log("main.js", response,status);
					if(response.error) $form.find(".credential-err").html(response.error).fadeIn();
					//if(status === "success" ) window.location.replace("/");

				});

			});
		},
		events:function(){
			$(".post").click(function(){
				$.post("/blog/post",function(res,status){
					console.log("main.js", res);
				})
			})
		}
	}

	app.init();

})(jQuery)