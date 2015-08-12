var express = require("express"),
	app 	= express(),
	$F = require("../configs/functions"),
	User = require("../models/user"),
	Configs = require("../models/configs"),
	Post = require("../models/posts"),
	Page = require("../models/pages"),
	http = require("request");

	
//Controllers
var GET = {
	loginCtrl:function(req,res){
		res.render("login" );
	},
	dashboardCtrl:function(req,res){
		var data =  $F.dataParser(req.shared);
		var currentUser = $F.dataParser(req.user);
		res.render("panel", { backend: data, currentUser: currentUser });
	},
	postsCtrl:function(req,res){
		console.log("private-request.js", "got req ");
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