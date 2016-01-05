module.exports = function(app){


	var $utils  = require("../lib/utils")(app),
	toSlug  = require('to-slug-case'),
	User    = require("../models/user"),
	Configs = require("../models/configs"),
	Post    = require("../models/posts"),
	Page    = require("../models/pages"),
	Comment = require("../models/comments");
	
	return {
		search_term: function(req,res){
			console.log("api-request.js :149", req.body);
			Post.find({ "title": new RegExp(req.body.name) }, function(err,post){
				if(post) res.send(post)
					else res.send(err)
			});
		},
		upload_photo:function(req,res){
			res.send("<script> window.$('body').find('#cke_137_textInput') </script>");
		},
		upload_avatar:function(req,res){
			var userId = req.params.id;
			User.findById( userId, function(err,user){
				if(err) return res.send(new Message(null,"Error uploading"))
				user.avatar = "/avatar/" + req.file.filename;
				user.save();
				res.redirect("/admin/users/"+user._id);
			});
		},
	};

}