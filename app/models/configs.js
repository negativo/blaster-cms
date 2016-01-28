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
	home:String,
	navigation:Array,
	links: Array,
	analytics: { type:String }
});


/**
 * EXPORT MODEL
 */
module.exports = mongoose.model("Config", ConfigsSchema );

