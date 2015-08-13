var express = require("express"),
	app 	= express(),
	$F = require("../configs/functions"),
	User = require("../models/user"),
	Configs = require("../models/configs"),
	Post = require("../models/posts"),
	Page = require("../models/pages");

	
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

};

//REMOVE RANDOM GENERATED PAGE
//AND POSTS AFTER TESTING END


exports.GET = GET;
exports.POST = POST;