module.exports = function(mustBeRole){

	var user_power = {
		admin: 10,
		moderator:9,
		guest:1
	}

	function mustBe(req, res, next, mustBeRole){
		var logged_role = req.user ? req.user.role : 'guest';

		if ( user_power[logged_role] >= user_power[mustBeRole] ){
			next();
		} else{
			res.sendStatus(403);
		}
	}
	
	return function(req,res,next){
		mustBe(req, res, next, mustBeRole);
	}
}