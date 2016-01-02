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
		show: function (req, res) {
			var slug = req.params.page.toString();	
			Page.findOne({ "slug": slug },function(err,page){
				console.log("requests.js", page,err);
				if(page === null && req.url !== "/favicon.ico" ) return res.redirect("/404");
				app.locals.pagetitle = page.title + " - " + app.locals.sitename;
				res.render( page.template, new Render(req, { page:page }) );
			});
		},
	};

}