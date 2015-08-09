var mongoose = require("mongoose");

var PageSchema = mongoose.Schema;

var Page = new PageSchema({
	slug:String,
	template:String,
	title:String,
	content:String,
	status:String
});

module.exports = Page.model("pages", PageSchema, "pages");