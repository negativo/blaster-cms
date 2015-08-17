var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Page = new Schema({
	slug:String,
	title:String,
	body:String,
	publishedBy:{
		user:String,
		date:{ type: Date, default: Date.now() }
	},
	editedBy:{
		user:String,
		date:Date
	},
	template: { type: String, default: "page-template" },
	status:String
});

module.exports = mongoose.model("pages", Page, "pages");