
module.exports = function(app){
	var pjson = require(app.locals.__root + "/package.json");

	app.get('/api', function(req,res){
		res.send('API Version: ' + pjson.version);
	});

}

