require("../controllers/controllers")();
module.exports = function(app,express){
	
	//GET
	app.get("/", homeCtrl);
	app.get("/install", installCtrl);

	//POST
	app.post("/install/:data",function(req,res){
		require("../controllers/install").install(req.body);
	})
}