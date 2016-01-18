module.exports = function(app){

	var toSlug = require('to-slug-case'),
	User       = require("../models/user"),
	Configs    = require("../models/configs"),
	Post       = require("../models/posts"),
	Page       = require("../models/pages"),
	Comment    = require("../models/comments"),
	Media      = require("../models/media");

	return {
		index: function (req, res) {
			res.locals.pagename = " Media";
			res.locals.bodyclass = "dashboard-media";
			Media.getUserMedia( req.user._id, function(err, medias){
				if(err) console.log("media.js :17", err);
				res.locals.medias = medias;
				res.render("media");
			});
		},
		show: function (req, res) {
			res.send("show single");
		},
		create:function(req,res){
			res.send("create view");
		},
		store:function(req,res){
			res.send("store single");
		},
		destroy:function(req,res){
			var image_id = req.params.id;
			Media.removeMedia(image_id, function(err){
				if(!err) res.send("delete");
			});
		},
		edit:function(req,res){
			res.send("edit view");
		},
		update:function(req,res){
			res.send("update");
		},
	};

}