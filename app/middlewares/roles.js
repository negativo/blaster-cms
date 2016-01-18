module.exports = function(mustBeRole){

	var user_power = {
		admin: 10,
		moderator:9,
		guest:1
	}

	function mustBe(req, res, next, mustBeRole){
		var logged_role = req.user ? req.user.role : 'guest';

		var isContentMine = req.user ? (req.user._id.toString() === req.params.id && req.method != "GET") : false;

		if ( user_power[logged_role] >= user_power[mustBeRole] || isContentMine ){
			return next();
		} 
		
		if( req.isAuthenticated() && req.user.role == 'guest' && req.method == "GET"){
			return res.redirect('/admin/users/' + req.user._id);
		}

		return res.redirect(403, '/admin');
	}
	
	return function(req,res,next){
		mustBe(req, res, next, mustBeRole);
	}
}