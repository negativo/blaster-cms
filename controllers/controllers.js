var dotenv = require("dotenv").load();

module.exports = function(){

	installCtrl = function(req,res){
		res.render("install", {
			title: process.env.BLOG_NAME + " - Installation"
		});		
	}

	homeCtrl = function(req,res){
		res.render("home", {
			title: process.env.BLOG_NAME + " - Home"
		});
	}

}