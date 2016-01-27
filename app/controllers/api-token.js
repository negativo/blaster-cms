module.exports = function(app){


	var User    = require(app.locals.__app + "/models/user"),
	ApiToken    = require(app.locals.__app + "/models/api-token");

	
	return {
		index: function(req,res){
			ApiToken.find({}, function(err, apitoken){
				if(err) res.send(err);
				res.send(apitoken);
			});
		},
		generateToken:function(req,res){
			var user_id  = req.body.user_id  || req.params.user_id  || req.query.user_id;
			var username = req.body.username || req.params.username || req.query.username;
			var password = req.body.password || req.params.password || req.query.password;

			if((!username || !user_id) && !password) return res.send(404);

			User
				.findUserComparePassword({ username:username, user_id:user_id }, password)
				.then(function(userCheck){
					if(!userCheck.auth) return res.send(401);

					ApiToken.findByUserId( userCheck.user_id, function(err,token){
						if(err) console.log("api-token.js :29", err);

						if(!token.length){
							new ApiToken({
								user: userCheck.user_id
							}).save(function(err, token){
								if(err) res.send(err);
								
								User.findOne({ _id: userCheck.user_id}, function(err, user){
									user.apiToken = token._id;;
									user.save();
								});

								res.status(200).send(token);
							});
						}else{
							res.status(405).send("user has a token yet");
						}
					});
				})
				.catch(function(err){
					console.log("api-token.js :30", err);
					res.send(err)
				});
		},
	};

}