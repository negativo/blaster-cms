var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username:String,
	password:String,
	createdOn:Date,
	role:String,
	admin:Boolean
});

module.exports = mongoose.model("user", UserSchema,"user");
