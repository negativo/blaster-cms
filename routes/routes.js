var $F = require("../configs/functions");

var ruotesControllers = require("../controllers/requests"),
	POST = ruotesControllers.POST,
	GET = ruotesControllers.GET;

module.exports = function(app,express){

	//GET

	//POST
	//////////Refactor in controller later
	app.post("/install/mongo", POST.install.mongo);
	app.post("/install/blog", POST.install.cms);

	app.post("/blog/post",function(req,res){
		res.send("ciao");	
	})
}