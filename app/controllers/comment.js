module.exports = function(app){

	var toSlug = require('to-slug-case'),
	$utils = require("../lib/utils")(app),
	User = require("../models/user"),
	Configs = require("../models/configs"),
	Post = require("../models/posts"),
	Page = require("../models/pages"),
	Comment = require("../models/comments"),
	Render = require("../lib/render-helper").public;

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
		}
	};

}





		
