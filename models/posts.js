var mongoose = require("mongoose");
var User = require("./user");

var Schema = mongoose.Schema;

var PostSchema = new Schema({
	// postedBy: {
 //        type: mongoose.Schema.Types.ObjectId,
 //        ref: 'User'
 //    },
	title:String,
	slug: String,
	body:String,
	template:String,
	publishedBy:{
		user:String,
		date:Date
	},
	status:String
});

module.exports = mongoose.model("posts", PostSchema);
