module.exports = function(app){

	app.get('/private', function(req,res){
		res.send('private extends');
	});

}

