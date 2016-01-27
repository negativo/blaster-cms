module.exports = function(app){

	var User = require( app.locals.__app + "/models/user"),
	Configs  = require( app.locals.__app + "/models/configs"),
	Post     = require( app.locals.__app + "/models/posts"),
	Page     = require( app.locals.__app + "/models/pages"),
	Comment  = require( app.locals.__app + "/models/comments");

	return {
		home_index: function(req,res){
			// //static homepage
			if (app.get('home') === "home-template"){
				Post.find({},function(err,posts){
					res.locals.pagetitle = "HOME" + " - " + app.locals.sitename;
					res.render( "home-template" , { posts:posts });
				}).sort({ "publishedBy.date": -1 }).populate("publishedBy.user",{ password:0 });
			}
			// Render chosen page as homepage 
			else{
				Page.findOne({ "_id": app.get('home') },function(err,page){
					if(page === null && req.url !== "/favicon.ico" ) return res.redirect("/404");
					res.locals.pagetitle = page.title + " - " + app.locals.pagetitle;
					res.render( page.template, { page:page });
				});
			}
		},
		not_found_page: function(req,res){
			res.locals.pagetitle = "404 - " + app.locals.sitename;
			res.render("404");
		},
		search_term: function(req,res){
			var searchExp = new RegExp(req.body.term, "i");
			Post.find({  $or: [{"title": searchExp}, {"body": searchExp}, {"tags": searchExp} ] }, function(err,post){
				res.locals.pagetitle = "Search - " + app.locals.sitename;
				console.log("public.js :36", post);
				res.render("search", { results: post });
			});
		},
	};
}
