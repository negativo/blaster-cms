module.exports = function(req,res,next){
	if(typeof req.user != 'undefined'){
		//user is connected, check for type
		if(req.user.role != 'admin'){

		}else{
			
		}
	}
	next();
}