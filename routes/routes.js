require("../controllers/controllers")();
module.exports = function(app,express){
	
	//home
	app.get("/", homeCtrl);

	//install
	app.get("/install",function(req,res){
		res.render("install");
	});

}