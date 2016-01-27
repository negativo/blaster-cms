module.exports = function(app){

	app.get('/extend', function(req,res){
		res.send('extend routes public ready');
	});

}

