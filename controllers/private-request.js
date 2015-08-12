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
		console.log("private-request.js", "GOT REQUEST FOR POSTS >>> CALLING API");
		http( base_url + "/api/posts", function (error, response, body) {
			if (!error && response.statusCode == 200) {
				res.send(body);
			}
		});
	},
	pagesPageCtrl:function(req,res){
		console.log("private-request.js", "GOT REQUEST FOR PAGES >>> CALLING API");
		http( base_url + "/api/pages", function (error, response, body) {
			if (!error && response.statusCode == 200) {
				res.send(body);
			}
		});
	},
	usersPageCtrl:function(req,res){
		console.log("private-request.js", "GOT REQUEST FOR USERS >>> CALLING API");
		http( base_url + "/api/users", function (error, response, body) {
			if (!error && response.statusCode == 200) {
				res.send(body);
			}
		});
	},
	configurationsPageCtrl:function(req,res){
		console.log("private-request.js", "GOT REQUEST FOR CONFIGURATIONS >>> CALLING API");
		http( base_url + "/api/configurations", function (error, response, body) {
			console.log("private-request.js >>>>>>>>>>>>>", req.isAuthenticated() );
			if (!error && response.statusCode == 200) {
				res.send(body);
			}
		});
	}
};

var POST = {
	loginCtrl:function(req,res){
		//console.log("routes.js", req.session);
		console.log("private-request.js", req.login);
		res.json({ err:undefined });
	}
};



exports.GET = GET;
exports.POST = POST;