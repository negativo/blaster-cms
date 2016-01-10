module.exports = function(app){


	var $utils  = require("../lib/utils")(app),
	toSlug  = require('to-slug-case'),
	User    = require("../models/user"),
	Configs = require("../models/configs"),
	Post    = require("../models/posts"),
	Page    = require("../models/pages"),
	Media   = require("../models/media"),
	Comment = require("../models/comments");
	
	return {
		search_term: function(req,res){
			console.log("api-request.js :149", req.body);
			Post.find({ "title": new RegExp(req.body.name) }, function(err,post){
				if(post) res.send(post)
					else res.send(err)
			});
		},
		upload_photo:function(req,res,next){
			req.files.forEach(function(element, index, array){
				new Media({
					filename: element.filename,
					path: "/uploads/" + element.filename
				}).save();
			});
			res.send(req.files);
		},
		upload_avatar:function(req,res,next){
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