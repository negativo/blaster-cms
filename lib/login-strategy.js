/// TO DO NOW
var LocalStrategy = require('passport-local').Strategy;
var crypto = require("./crypto");
var User = require("../models/user");
// var FacebookStrategy = require("passport-facebook").Strategy;
// var facebookConf    = require("./confAuth")

module.exports = function(passport,$ee){

  // serializza pure la pass
  passport.serializeUser(function(user, done) {
    var serializedUser = {
      id: user.id,
      user: user.username,
      admin: user.admin
    }
    done(null, serializedUser);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  //local Strategy
  passport.use(
    new LocalStrategy(
      function(username, password, done) {
        User.findOne({ 'username': username }, function (err, user) {

          //show err if exist
          if (err) { return done(err); }

          //user don't exist
          if (!user) {
            console.log("Incorrect Username");
            $ee.emit("login_event", "Incorrect Username");
            return done(null, false, { message: 'Incorrect username.' });
          }

          if(user.password !== crypto.encrypt(password) ){
              console.log("Password Incorrect");
              $ee.emit("login_event", "Password Incorrect");
              return done(null, false, { message: 'Incorrect password.' });
          } else {
              console.log("logged");
              $ee.emit("login_event", "Login Succesfull");
              return done(null, user);          
          }
        });
      }
    )
  );
  
}