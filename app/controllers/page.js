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
			Page.find({},function(err,pages){
				if(err) res.json({err:"not found"});
				res.json(pages);
			});
		},
		show: function (req, res) {
			var slug = req.params.page.toString();	
			Page.findOne({ "slug": slug },function(err,page){
				console.log("requests.js", page,err);
				if(page === null && req.url !== "/favicon.ico" ) return res.redirect("/404");
				app.locals.pagetitle = page.title + " - " + app.locals.sitename;
				res.render( page.template, new Render(req, { page:page }) );
			});
		},
		create:function(req,res){
		},
		store:function(){
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
		destroy:function(req,res){
			res.send("");
		},
		edit:function(req,res){
			res.send("");
		},
		update:function(req,res){
			res.send("");
		},
	};

}





		
