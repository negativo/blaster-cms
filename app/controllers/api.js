module.exports = function(app){


	var User    = require(app.locals.__app + "/models/user"),
	Configs = require(app.locals.__app + "/models/configs"),
	Post    = require(app.locals.__app + "/models/posts"),
	Page    = require(app.locals.__app + "/models/pages"),
	Media   = require(app.locals.__app + "/models/media"),
	Comment = require(app.locals.__app + "/models/comments");
	
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
					path: "/uploads/" + element.filename,
					owner: req.user._id,
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
		fileBrowser: function(req,res){
			function callback(items){
				var pattrn = /.+\.jpg/;
				var images = [];
				items.forEach(function(el, i){
					if(pattrn.test(el)){
						var source = {
					    "imageUrl": "/uploads/" + el,
					    "value": "/uploads/" + el,
					  };
					  images.push(source)
					}
				})
				res.send(images);
			}

			fs.readdir(app.locals.__root + '/uploads', function(err, files){
				callback(files);
			});
		},
	};

}