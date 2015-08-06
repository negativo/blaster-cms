var installer = require("../controllers/install");
require("../controllers/controllers")();

module.exports = function(app,express){

	//req.render have data for views/partials

	//debug
	// app.get("*",function(req,res){
	// 	console.log("routes.js", req);
	// })

	//GET
	app.get("/", homeCtrl);
	app.get("/install", installCtrl);

	//POST
	//////////Refactor in controller later
	app.post("/install/mongo",function(req,res){
		//check if err is null in frontend
		installer.checkMongo(req.body)
			.then(function(promise){
				res.status(promise.status)
				res.send(promise);
			})
			.fail(function(err){
				res.status(err);
				res.send(err);
			});
	});
	app.post("/install/:data",function(req,res){
		installer.getUserInfo(req.body)
		.then(function(data){
			///REDIRECT HOME
		})
		.fail(function(err){
			res.status(err);
			res.send(err);
		});
	});
}