var express = require("express"),
	app 	= express(),
	$F = require("../configs/functions"),
	User = require("../models/user"),
	Configs = require("../models/configs"),
	Post = require("../models/posts"),
	Page = require("../models/pages"),
	http = require("request");

var base_url = global.base_url;
	
//Controllers
var GET = {
	loginPageCtrl:function(req,res){
		res.render("login" );
	},
	dashboardPageCtrl:function(req,res){
		var data =  $F.dataParser(req.shared);
		var currentUser = $F.dataParser(req.user);
		res.render("panel", { backend: data, currentUser: currentUser });
	},
	postsPageCtrl:function(req,res){
		res.send("ToBeDone");
	},
	pagesPageCtrl:function(req,res){
		res.send("ToBeDone");
	},
	usersPageCtrl:function(req,res){
		res.send("ToBeDone");
	},
	configurationsPageCtrl:function(req,res){
		res.send("ToBeDone");
	}
};

var POST = {
	loginCtrl:function(req,res){
		//console.log("routes.js", req.session);
		res.json({ err:undefined });
	}
};



exports.GET = GET;
exports.POST = POST;