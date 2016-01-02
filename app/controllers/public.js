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
		home_index: function(req,res){
			// //static homepage
			if (app.get('home') === "home-template"){
				Post.find({},function(err,posts){
					app.locals.pagetitle = "HOME" + " - " + app.locals.sitename;
					res.render( "home-template" , new Render(req, { posts:posts }) )
				}).sort({ "publishedBy.date": -1 }).populate("publishedBy.user",{ password:0 });
			}
			// Render chosen page as homepage 
			else{
				Page.findOne({ "_id": app.get('home') },function(err,page){
					if(page === null && req.url !== "/favicon.ico" ) return res.redirect("/404");
					app.locals.pagetitle = page.title + " - " + app.locals.pagetitle;
					res.render( page.template, new Render(req, { page:page }) );
				});
			}
		},
		not_found_page: function(req,res){
			app.locals.pagetitle = "404 - " + app.locals.sitename;
			res.render( "404" , new Render(req,{}) );
		},
		search_term: function(req,res){
			var searchExp = new RegExp(req.body.term, "i");
			Post.find({  $or: [{"title": searchExp}, {"body": searchExp}, {"tags": searchExp} ] }, function(err,post){
				res.render("search", new Render(req, { results: post }));
			});
		},
	};
}
