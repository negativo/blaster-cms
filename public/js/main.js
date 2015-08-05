(function(){
	
	//BlogNameSpace
	var blog = {
		init: function(){
			blog.installation();
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
						$formMongo.fadeOut();
						$form.fadeIn();
					} else{
						$formMongo.find(".mongo-err").text("Error: Check you database reference.").fadeIn();
					}
				});

			});
			$submit.click(function(e){
				e.preventDefault();
				var url = $form.serialize();
				var data = {
					blogName:$form.find(".blogName").val(),
					username:$form.find(".username").val(),
					password:$form.find(".password").val()
				}

				$.ajax({
				  type: "POST",
				  url: "/install/"+url,
				  data:data,
				  success: function(data){
				  	console.log(data)
				  }
				});
			});
		}
	}

	blog.init();

})(jQuery)