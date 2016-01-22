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


				if(!apitoken && !req.user && user_power[mustBeRole] > 1) res.status(403).send('Unauthorized.');

				if(apitoken) request_user_role = apitoken.user.role || request_user_role;

				process.emit('authorization_check', request_user_role + " trying to access " + mustBeRole + " resources");
				
				var isGuestIsProfilePage = req.user ? (req.user._id.toString() === req.params.id && req.method != "GET") : false;

				if ( (user_power[request_user_role] >= user_power[mustBeRole]) || isGuestIsProfilePage ){
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