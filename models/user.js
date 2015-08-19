var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username:String,
	password:{ type:String, select:false },
	name:String,
	email:String,
	createdOn:Date,
	role:String,
	admin:Boolean
});

module.exports = mongoose.model("User", UserSchema);
