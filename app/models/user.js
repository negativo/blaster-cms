var mongoose = require("mongoose");
var crypto = require("../lib/crypto");
var Q = require('q');
var Message  = require("../lib/message-helper").message;

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

/**
 * HOOKS
 */

UserSchema.pre('save',function(next){
	// hash password if saving to db or skip
	var user = this;
	if (!user.isModified('password')) return next();	
	user.password = crypto.bcrypt.encrypt(user.password);
	next();

})

/**
 * INSTANCE METHODS
 */

UserSchema.methods.comparePassword = function(candidatePassword) {
	/**
	 * Compare string password with hashed in database
	 * @param  {String} candidatePassword
	 * @return {boolean}
	 */
  return crypto.bcrypt.compare(candidatePassword, this.password);
};


/**
 * MODEL METHODS
 */

UserSchema.statics.change_password = function(user_id, old_password, new_password) {
	/**
	 * Change user password
	 * @param  {String} user_id      
	 * @param  {String} old_password 
	 * @param  {String} new_password 
	 * @return {Promise}              
	 */
	
	var deferred = Q.defer();
	this.findById( user_id, { password:1 }, function(err,user){
		if(user) {
			if( user.comparePassword(old_password) ){
				user.password = new_password;
				user.save(function(err,saved){
					console.log("functions.js :47", err, saved);
					if (err === null) deferred.resolve("Password changed");
					if (err !== null) deferred.reject("error while saving " + err);
				});
			}else{
				deferred.reject("current password incorrect ");
			};
		}
		if(err) {
			deferred.reject("user not found " + err);
		}
	});
	return deferred.promise;
};

UserSchema.statics.register_new = function(new_user) {
	var deferred = Q.defer();
	var UserModel = this;

	this.findOne({ "username": new_user.username },function(err, user){
		if(user) return res.send( new Message(null, "User Exists") );
		new UserModel({ 
			username:new_user.username, 
			password:new_user.password,
			role:"guest"
		})
		.save(function(err,user){
			if ( err === null ) return deferred.resolve(new Message("User Created!"));
			return deferred.reject( new Message(null, "Error saving user, try again!") );
		});
	});
	
	return deferred.promise;
};


module.exports = mongoose.model("User", UserSchema);

