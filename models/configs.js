var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//var ConfigsSchema = Schema({}, { strict: false });

var ConfigsSchema = Schema({
	db_link : String,
	isInstalled : Boolean,
	admin : String,
	title : String,
	subtitle : String,
	theme : String,
	templates : {
		"home-template" : String,
		"page-template" : String,
		"post-template" : String
	},
	navigation:Array,
	links: Array
});

module.exports = mongoose.model("configs", ConfigsSchema ,"configs");
