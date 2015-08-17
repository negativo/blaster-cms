(function(){
	
	//BlogNameSpace
	var app = {
		init: function(){
			app.installation();
			app.events.init();
			app.ui.init();
		},
		installation:function(){
			var $formMongo = $(".installation-form-mongo");
			var $form = $(".installation-form-info");
			var $submit = $form.find(".install-submit");
			var $mongoSubmit = $(".mongo-submit");
			var $spinner = $(".spinner");

			$(".mongo-localhost").click(function(e){
				e.preventDefault();
				$formMongo.find(".mongo-link").val("mongodb://localhost:27017");
			});

			$form.hide();
			$mongoSubmit.click(function(e){
				e.preventDefault();
				$spinner.fadeIn();
				var data = {
					link: $formMongo.find("input").val().trim()
				}
				$.post("/install/mongo", data, function(data,status){
					console.log(status,data);
					if(data.err === null && data.status === 200){
						setTimeout(function(){
							$spinner.fadeOut();
							$formMongo.fadeOut(500,function(){
								$form.fadeIn();
							});
						}, 1500);
					} else{
						$formMongo.find(".mongo-err").html(data.err.message).fadeIn();
					}
				});

			});
			$submit.click(function(e){
				e.preventDefault();
				$spinner.fadeIn();
				var url = $form.serialize();
				var data = {
					title:$form.find(".site-title").val(),
					subtitle:$form.find(".site-subtitle").val(),
					username:$form.find(".user-username").val(),
					password:$form.find(".user-password").val()
				}

				$.post("/install/cms", data, function(response,status){
					console.log("main.js", status, response);
					setTimeout(function(){
						if(response.error){
							$spinner.fadeOut(100);
							$form.find(".credential-err").html(response.error).fadeIn();
						}
						if(response.isInstalled) window.location.replace("/");
					},1500);
				});

			});
		},
		events:{
			init:function(){
				//this.spinners();
			},
			spinners:function(){},
		},
		ui:{
			init:function(){
				this.centerForms();
			},
			centerForms:function(){
				var $contHeight = $(".container").height(),
					$docHeight = $(document).height();
				//align vertical
				var margin = ($docHeight - $contHeight)/2;

				$(".container").css("margin-top",margin+"px");
			}
		}
	}



	app.init();

})(jQuery)