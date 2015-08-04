var dotenv = require("dotenv").load();

module.exports = function(){

	homeCtrl = function(req,res){
		res.render("home", {
			title: process.env.BLOG_NAME + " - Home"
		});
	}

}