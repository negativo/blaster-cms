(function($, window, document, undefined){
	
	var settings = {
		init:function(){
			console.log("dummy.js :5", "settings up");
			this.bindEvents();
		},
		bindEvents:function(){
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

				$settingsForm.submit(settings.settingUpdate);

				$("#custom-css-form").submit(settings.customCss);
				
				$("#themes-form").submit(settings.chooseTheme);
		},
		settingUpdate:function(e){
			e.preventDefault();
			$socialsContainer.find(".social-link").each(function(i){
				var social = {
					website: $(this).prev().text().trim(),
					link: $(this).val().trim()
				}
				getLinks.push(social);
				//console.log("backend.js", getLinks);
			});
			var settings = {
				siteTitle: $("#site-title").val().trim(),
				subtitle: $("#site-subtitle").val().trim(),
				home: $("#homepage").val(),
				links: getLinks,
				analytics: $('#code-editor').val().replace(new RegExp("<?.script>",'g'), '').trim()
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
		},
		customCss:function(e){
			var	$css = $(".custom-css");

			e.preventDefault();
			var editor = CODE_EDITOR;					
			var data = { css: editor.getValue() };
			$.post("/api/custom-css", data, function(res,status){
				if (res === "success") toastr.success("Custom CSS updated!");
			});
		},
		chooseTheme:function(e){
			e.preventDefault();
			var data = {
				theme: $("#avaible-themes").val()
			}
			$.post("/api/themes", data, function(res){
				if(res === "success") {
					toastr.success("Reload!","Theme changed");
					pageReload();
				}
			});
		},
	};

	$(document).ready(function(){
		settings.init();
	});

	return settings;

})(jQuery, this, document);
