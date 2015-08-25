var express = require("express"),
	app 	= express(),
	$F = require("../configs/functions"),
	toSlug = require('to-slug-case'),
	User = require("../models/user"),
	Configs = require("../models/configs"),
	Post = require("../models/posts"),
	Page = require("../models/pages"),
	Comment = require("../models/comments");

	
//Controllers
var GET = {
	allPostsCtrl:function(req,res){
		console.log("api-request.js", "GOT REQUEST FOR POSTS");
		Post.find({}, function(err, posts){
			if(posts !== null) return res.status(200).send(posts);
			res.status(404).send("No posts found");
		});
	},
	allPagesCtrl:function(req,res){
		Page.find({}, function(err, pages){
			if(pages !== null) return res.status(200).send(pages);
			res.status(404).send("No pages found");
		});
	},
	usersCtrl:function(req,res){
		User.findOne({}, function(err, user){
			if(user !== null) return res.status(200).send(user);
			res.status(404).send("No user found");
		});
	},
	configsCtrl:function(req,res){
		Configs.findOne({}, function(err, configs){
			if(configs !== null) return res.status(200).send(configs);
			res.status(404).send("No configs found");
		});
	}
};

var POST = {
	install:{
		mongo:function(req,res){
			//console.log("requests.js MONGOLINK", req.body);
			//check if err is null in frontend
			$F.checkDatabase(req.body)
				.then(function(promise){
					res.send(promise);
				})
				.catch(function(err){
					console.log("api-request.js :51 >>>>>>>>", err);
					res.send(err);
				});
		},
		cms:function(req,res){
			$F.installation(req.body)
			.then(function(data){
				console.log("api-request.js :58", data);
				req.isInstalled = true;
				res.send(data)
			})
			.fail(function(data){
				console.log("api-request.js :58", data);
				res.send(data)
			});
		}
	},//install methods
	create:{
		post:function(req,res){
			console.log("routes.js", "/create/post request");
			console.log("POST DATA: ", req.body);
			var post = req.body;
			new Post({
				title: post.title || "Post Title",
				slug: toSlug(post.title),
				body: post.body || "Post Body",
				template: post.template || "post-template",
				publishedBy:{
					user: req.user.id,
					date:Date.now()
				},
				tags: post.tags || [],
				status:"Published"
			}).save();
			res.send("success");	
		},
		page:function(req,res){
			console.log("routes.js", "create_page request");
			var page = req.body;
			new Page({
				title: page.title || "Page Title" ,
				slug:toSlug(page.title),
				body: page.body || "Page Body" ,
				template: page.template || "page-template",
				publishedBy:{
					user: req.user.id,
					date:Date.now()
				},
				status:"published"
			}).save();
			res.send("success");	
		},
		comment:function(req,res){
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
	},
	searchCtrl:function(req,res){
		console.log("api-request.js :149", req.body);
		Post.find({ "title": new RegExp(req.body.name) }, function(err,post){
			if(post) res.send(post)
				else res.send(err)
		});
	}
};


exports.GET = GET;
exports.POST = POST;