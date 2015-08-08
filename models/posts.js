var mongoose = require("mongoose");
var User = require("./user");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	_creator.{type: Schema.Types.ObjectId, ref:"User" }
	username:String,
	password:String,
	createdOn:Date,
	admin:Boolean
});

module.exports = mongoose.model("user", UserSchema,"user");
