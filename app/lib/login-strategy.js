/// TO DO NOW
var LocalStrategy = require('passport-local').Strategy;
var crypto = require("./crypto");
var User = require("../models/user");
// var FacebookStrategy = require("passport-facebook").Strategy;
// var facebookConf    = require("./confAuth")

module.exports = function(passport){

  // serializza pure la pass
  passport.serializeUser(function(user, done) {
    var bcrypt = require('bcrypt');
    var serialized = {
      id: user.id,
      token: bcrypt.genSaltSync(10),
    }
    done(null, serialized);
  });

  passport.deserializeUser(function(user, done) {
    User.findById( user.id , function(err, user){
      done(null, user);
    });
  });


  //local Strategy
  passport.use(
    new LocalStrategy(
      function(username, password, done) {
        User.findOne({ 'username': username },{ username:1,password:1,name:1,email:1,createdOn:1,role:1,admin:1, avatar:1 }, function (err, user) {

          //show err if exist
          if (err) { return done(err); }
          //user don't exist
          if (!user) {
            process.emit("login_event", "Incorrect Username attempt for user: " + username);
            return done(null, false, { message: 'Incorrect username.' });
          }
          if ( user.comparePassword(password) ){
              process.emit("login_event", "User : " + username + " - Login Succesfull");
              return done(null, user);          
          } else {
              process.emit("login_event", "Password Incorrect attempt for user: " + username);
              return done(null, false, { message: 'Incorrect password' });
          }
        });
      }
    )
  );
  
}