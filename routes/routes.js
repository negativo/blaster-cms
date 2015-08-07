var installer = require("../controllers/install");
var shared = require("../configs/functions").shared;
require("../controllers/controllers")();

module.exports = function(app,express){

	//GET
	app.get("/", homeCtrl);

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
			res.status(301);
			shared.isInstalled = true;
			res.redirect("/");
		})
		.fail(function(err){
			shared.isInstalled = false;
			res.status(err);
			res.send(err);
		});
	});
}