(function($, window, document, undefined){
	
	var navigation = {
		init:function(){
			console.log("dummy.js :5", "navigation up");
			this.bindEvents();
		},
		bindEvents:function(){
			var $addLink = $(".add-navigation-link"),
					$navigationForm = $("#navigation-form");


			$("body").on('click','.add-page-to-nav', navigation.addPageToNav);

			$(".remove-page-from-nav").click(function(e){
				e.preventDefault();	
				$(this).parent().remove();
				$("#navigation-form").submit();
			});				

			$addLink.click(function(e){
				$navigationsContainer.append('<div class="form-group"><label for="text" contenteditable>Edit Nav Name</label><input type="text" class="form-control navigation-link" placeholder="URL"></div>');
			});	

			$navigationForm.submit(navigation.saveNavigation);		
		},
		addPageToNav:function(e){
			e.preventDefault();
			e.stopPropagation();

			var $navigationsContainer = $(".navigation-link-container");
			
			var existings = {
				slug: $(this).parent().data("slug"),
				title: $(this).parent().data("title")
			};

			var $link = $('body').find('.navigation-link-single-template').clone(true);

			$link
				.find('label')
				.html(existings.title)
				.end()
				.find('input')
				.val(existings.slug )
				.end()
				.removeClass('navigation-link-single-template')
				.addClass('navigation-link-single')
				.removeClass('hide');
			
			$navigationsContainer.append($link);
			
		},
		saveNavigation:function(e){
			e.preventDefault();
			getNavigation = { links:[] };

			var $navigationsContainer = $(".navigation-link-container");

			$navigationsContainer.find(".navigation-link").each(function(i){
				var navigation = {
					linkName: $(this).prev().text().trim(),
					link: $(this).val().trim(),
					display:true
				}
				getNavigation.links.push(navigation);
				//console.log("backend.js", getNavigation);
			});

			$.post("/api/navigation", getNavigation ,function(res,status){
				console.log("backend.js", res);
				getNavigation.links = [];
				toastr.success('Navigation Changed!');
			});
			
		},
	}

	$(document).ready(function(){
		navigation.init();
	});

	return navigation;

})(jQuery, this, document);



