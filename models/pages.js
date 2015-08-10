var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Page = new Schema({
	slug:String,
	template:String,
	title:String,
	content:String,
	publishedBy:{
		user:String,
		date:Date
	},
	editedBy:{
		user:String,
		date:Date
	},
	status:String
});

module.exports = mongoose.model("pages", Page, "pages");