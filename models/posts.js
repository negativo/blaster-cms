var mongoose = require("mongoose");
var User = require("./user");

var Schema = mongoose.Schema;

var PostSchema = new Schema({
	postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
	title:String,
	body:String,
	createdOn:Date,
	status:String
});

module.exports = mongoose.model("posts", PostSchema,"posts");
