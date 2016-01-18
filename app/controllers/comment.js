module.exports = function(app){

	var User = require("../models/user"),
	Configs = require("../models/configs"),
	Post = require("../models/posts"),
	Page = require("../models/pages"),
	Comment = require("../models/comments");

	return {
		index:function(req,res){
			Comment.find({},function(err,comments){
				if(err) res.json({err:"not found"});
				res.json(comments);
			});
		},
		show:function(req,res){
			
		},
		create:function(req,res){
		},
		store:function(req,res){
			var comment = req.body;
			comment.comment = comment.comment.trim();
			console.log("api-request.js :108", comment);
			if( req.user ){
				new Comment({
					comment: comment.comment,
					user: req.user.id,
					post_id: comment.post_id
				}).save(function(err, comment){
					console.log("api-request.js :114 SAVES", comment );
					Post.findById( comment.post_id, function(err, post){
						post.comments.push(comment._id);
						post.save(function(err){
							if(err === null ) return res.redirect("/post/"+post.slug);
						});
					});
				});
			}else{
				res.send("log in before commenting")
			}
		},
		reply:function(req,res){
			var reply = req.body;
			reply.comment = reply.comment.trim();
			if( req.user ){
				console.log("api-request.js :108", reply);
				new Comment({
					comment: reply.comment,
					user: req.user.id
				}).save(function(err, comment){
					Comment.findById( reply.parent_id, function(err,parent){
						parent.reply.push(comment._id);
						parent.save(function(err){
							if(err !== null) { }
						});
					})
				});
			}else{
				res.send("log in before commenting")
			}
		},
		destroy:function(req,res){
			var comment = req.body;
			Comment.findById( comment.id ).remove(function(err){
				Post.findById( comment.post_id, function(err,post){
					if (post.comments.indexOf(comment.id) > -1) {
					    post.comments.splice(post.comments.indexOf(comment.id), 1);
					}
					post.save(function(err){
						if(err === null) res.send("success");
					});
				});
			});
		},
		edit:function(req,res){
			res.send("");
		},
		update:function(req,res){
			var comment = req.body;
			console.log("private-request.js :316", comment);
			Comment.findById( comment.id, function(err,updateComment){
				updateComment.comment = comment.body;
				updateComment.save(function(err){
					console.log("private-request.js :324", err);
					if(err === null ) return res.send("success");
				})
			});
		},
	};

}





		
