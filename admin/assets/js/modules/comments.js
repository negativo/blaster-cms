(function($, window, document, undefined){
	
	var comments = {
		init:function(){
			console.log("dummy.js :5", "comments up");
			this.ui();
			this.bindEvents();
		},
		ui:function(){

		},
		bindEvents:function(){

			//edit comment
			$(".comment-body").click(function(){
				$(this).parent().find(".save-comment").fadeIn();
			});
			$(".edit-comment").click(function(){
				$( this ).siblings(".save-comment").fadeIn();
				$( this ).parent().parent().find(".comment-body").focus();
			});


			$(".save-comment").click(comments.saveComment);

			$("body").on('click','.remove-comment', comments.removeComment);
		},
		saveComment:function(e){
				e.stopPropagation();
				var $parent = $( this ).parent().parent(),
					$comment = $parent.find(".comment-body");
				var data = { action:"update", id:$comment.data("id").trim(), body: $comment.text() };
				$.post("/api/comment/" + data.id, data, function(res){
					if (res === "success" ) toastr.success("Comment edited!");
				});
		},
		removeComment:function(e){
				e.stopPropagation();
				//delete commment
				var $parent = $( this ).parent().parent();
				var data = { action:"delete", id:$(this).data("id"), post_id: $(this).data("post-id") };
				swal({
					title: "Are you sure?",
					text: "You will not be able to recover this comment!",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Yes, delete it!",
					closeOnConfirm: true 
				}, function(){
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
				});
		}
	};


	$(document).ready(function(){
		comments.init();
	});

	return comments;

})(jQuery, this, document);



