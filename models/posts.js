var mongoose = require("mongoose");
var User = require("./user");

var Schema = mongoose.Schema;

var PostSchema = new Schema({
	title:String,
	slug: String,
	body:String,
	status:String,
	template: { type: String, default: "post-template" },
	type: { type:String, default: "post" },
	tags: Array,
	comments:[{ type: Schema.ObjectId, ref:"Comment"}],
	publishedBy:{
		user:{ type: Schema.Types.ObjectId, ref:"User" },
		date:{ type: Date, default: Date.now() }
	},
	meta:{
		postedBy:{ type: Schema.Types.ObjectId, ref:"User" },
		date:{ type: Date, default: Date.now() },
		tags:Array
	}
	//refactor to use meta insied of publishedBy 
	//when I have or someone have time to check all the reference..FML
});

module.exports = mongoose.model("Post", PostSchema);
