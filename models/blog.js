var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var BlogSchema = new Schema({
	title:String,
	createdOn:Date
});

module.exports = mongoose.model("blog", BlogSchema);
