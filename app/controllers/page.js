module.exports = function(app){

	var User = require("../models/user"),
	Configs = require("../models/configs"),
	Post = require("../models/posts"),
	Page = require("../models/pages"),
	Comment = require("../models/comments");

	return {
		index:function(req,res){
			Page.find({},function(err,pages){
				if(err) res.json({err:"not found"});
				res.json(pages);
			});
		},
		index_admin: function (req, res) {	
			res.locals.pagename = " Pages";
			res.locals.bodyclass = "dashboard-pages";
			Page.find({},{ body:0 }, function(err, pages){
				if(pages !== null && req.isAuthenticated() ) {
					res.render("pages", { pages: pages });
				}
			});
		},
		index_public: function (req, res) {	
		},
		show: function (req, res) {
			var slug = req.params.page.toString();	
			Page.findOne({ "slug": slug },function(err,page){
				console.log("requests.js", page,err);
				if(page === null && req.url !== "/favicon.ico" ) return res.redirect("/404");
				res.locals.pagetitle = page.title + " - " + app.locals.sitename;
				res.render( page.template, { page:page });
			});
		},
		create:function(req,res){
			res.locals.pagename = " New Page";
			res.locals.bodyclass = "new-page";
			res.locals.isNew = true;
			Configs.findOne({},{ siteTemplate:1 }, function(err, templates){
				if(templates === null) return;
				res.render("editor", { editor: "page", templates: app.locals.templates.page });
			});
		},
		store:function(req,res){
			var page = req.body;
			new Page({
				title: page.title || "Page Title" ,
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
			if( req.params.id ){
				var pageId = req.params.id;
				Page.findById( pageId ,function(err,singlePage){
					console.log("private-request.js", singlePage );
					res.locals.pagename= singlePage.title + " edit";
					res.locals.bodyclass = "edit-page";
					res.locals.isNew = false;
					res.render("editor", { editor: "page", single: singlePage, templates: app.locals.templates.page });
				});
			}
		},
		update:function(req,res){
			console.log("page.js :67", "Edit single page");
			var pageId = req.body.id;
			Page.findById( pageId ,function(err,singlePage){
				singlePage.title = req.body.title;
				singlePage.body = req.body.body;
				singlePage.publishedBy.user = req.user.id;
				singlePage.template = req.body.template || "page-template",
				singlePage.save(function(err){
					if (err) throw err;
					res.send(200);
				});
			});
		},
	};

}
