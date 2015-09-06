var mongoose = require("mongoose");
var crypto = require("../lib/crypto");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username:String,
	password:{ type:String, select:false },
	name:String,
	email:String,
	avatar:String,
	createdOn:Date,
	role:String,
	admin:Boolean,
	resetPasswordToken: String,
  	resetPasswordExpires: Date
});

// HOOK
// UserSchema.pre('save',function(next){
// 	var user = this;
// 	if (!user.isModified('password')) return next();
// 	bcrypt.hash(user.password, salt, null, function(err, hash) {
// 		if (err) return next(err);
// 		user.password = hash;
// 		next();
// 	});
// })
// 
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  return crypto.bcrypt.compare(candidatePassword, this.password)
};

module.exports = mongoose.model("User", UserSchema);
