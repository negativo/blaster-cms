module.exports = function(mustBeRole){

	var ApiToken = require("../models/api-token");

	var user_power = {
		admin: 10,
		moderator:9,
		guest:1
	}

	function mustBe(req, res, next, mustBeRole){
		var request_user_role = req.user ? req.user.role : 'guest';

		var api_token = req.headers['x-api-token'] || null;


		ApiToken
			.findOne({ token: api_token })
			.populate({ path:'user', select:"role"})
			.exec(function(err, apitoken){
				if(err) console.log("roles.js :19", err);

				if(!apitoken) res.status(405).send('Authentication Token not valid.');

				if(apitoken) request_user_role = apitoken.user.role || request_user_role;

				
				var isContentMine = req.user ? (req.user._id.toString() === req.params.id && req.method != "GET") : false;

				if ( (user_power[request_user_role] >= user_power[mustBeRole]) || isContentMine ){
					return next();
				} 
				
				if( req.isAuthenticated() && req.user.role == 'guest' && req.method == "GET"){
					return res.redirect('/admin/users/' + req.user._id);
				}

				if( req.isAuthenticated() && req.user.role == 'guest' && req.method == "POST"){
					return res.send(403);
				}

				return res.redirect(403, '/admin');

			});
	}
	
	return function(req,res,next){
		mustBe(req, res, next, mustBeRole);
	}
}