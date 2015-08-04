module.exports = function(app,express){
	
	var home = {
		title: "jsDen",
		author: "Simone Corsi"
	}

	//home
	app.get("/",function(req,res){
		res.render("home", home);
	});

	//install
	app.get("/install",function(req,res){
		res.render("install");
	});

}