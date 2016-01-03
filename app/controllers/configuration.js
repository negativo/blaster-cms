module.exports = function(app){

	var toSlug = require('to-slug-case'),
	$utils     = require("../lib/utils")(app),
	User       = require("../models/user"),
	Config     = require("../models/configs"),
	Post       = require("../models/posts"),
	Page       = require("../models/pages"),
	Comment    = require("../models/comments"),
	Render     = require("../lib/render-helper").public;

	return {
		edit:function(req,res){
			Config.findOne({}, function(err, configs){
				configs.title = req.body.siteTitle;
				configs.subtitle = req.body.subtitle;
				configs.links = [];
				configs.links = req.body.links;
				configs.home = req.body.home;
				configs.save(function(err){
					if(!err) {
						//req.logout();
						res.send("success");
					}
				});
			});
		},
	};

}