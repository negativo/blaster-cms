var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username:String,
	password:String,
	createdOn:Date,
	admin:Boolean
});

module.exports = mongoose.model("users", UserSchema,"users");
