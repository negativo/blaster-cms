var installer = require("../controllers/install");
var $F = require("../configs/functions");
require("../controllers/controllers")();

module.exports = function(app,express){

	//GET
	app.get("/", homeCtrl);

	//POST
	//////////Refactor in controller later
	app.post("/install/mongo",function(req,res){
		//check if err is null in frontend
		$F.checkDatabase(req.body)
			.then(function(promise){
				res.status(promise.status)
				res.send(promise);
			})
			.fail(function(err){
				res.status(err);
				res.send(err);
			});
	});
	app.post("/install/blog",function(req,res){
		$F.installation(req.body)
			.then(function(promise){
				console.log("routes.js install promise", promise);
				res.send(promise);
			})
			.fail(function(err){
				console.log("routes.js install promise", err);

				res.status(403).send(err);
			}); //if return err:null installation is ok
	});
}