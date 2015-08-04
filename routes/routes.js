require("../controllers/controllers")();
module.exports = function(app,express){
	
	//GET
	app.get("/", homeCtrl);
	app.get("/install", installCtrl);

	//POST

}