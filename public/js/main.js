(function(){
	
	//BlogNameSpace
	var blog = {
		init: function(){
			blog.installation();
		},
		installation:function(){
			var $form = $(".installation-form");
			var $submit = $form.find(".install-submit");

			$submit.click(function(e){
				e.preventDefault();
				var url = $form.serialize();

				var data = {
					blogName:$form.find(".blogName").val(),
					username:$form.find(".username").val(),
					password:$form.find(".password").val(),
					mongoDB:$form.find(".mongoDB").val()
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