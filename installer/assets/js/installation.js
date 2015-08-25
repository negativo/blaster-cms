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
			var $mongoSubmit = $(".mongo-submit");
			var $form = $(".installation-form-info");
			var $submit = $form.find(".install-submit");
			var $spinner = $(".spinner");

			$form.hide();

			$(".mongo-localhost").click(function(e){
				e.preventDefault();
				$formMongo.find(".mongo-link").val("mongodb://localhost:27017");
			});

			$mongoSubmit.click(function(e){
				e.preventDefault();
				$spinner.fadeIn();
				var data = {
					link: $formMongo.find("input").val().trim()
				}
				$.post("/install/mongo", data, function(data,status){
					console.log("installation.js :31", data);
					if(!data.err){
						setTimeout(function(){
							$spinner.fadeOut();
							$formMongo.fadeOut(500,function(){
								$form.fadeIn();
								app.ui.centerForms();
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
				var data = {
					title:$form.find(".site-title").val(),
					subtitle:$form.find(".site-subtitle").val(),
					username:$form.find(".user-username").val(),
					password:$form.find(".user-password").val()
				};

				$.post("/install/cms", data, function(res,status){
					console.log("installation.js :57", res);
					// console.log("installation.js :57", res);
					// setTimeout(function(){
					// 	if(res.error){
					// 		$spinner.fadeOut(100);
					// 		$form.find(".credential-err").html(res.error).fadeIn();
					// 	}
					// 	if(res.isInstalled) window.location.replace("/");
					// },1500);
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
					$docHeight = $(window).height();
				//align vertical
				$("body").css("overflow","hidden");
				var margin = ($docHeight - $contHeight)/2;

				$(".container").css("margin-top",margin+"px");
			}
		}
	}

	app.init();
})(jQuery)