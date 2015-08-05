var crypto = require('crypto');
 
// var SaltLength = 9;
 
// function createHash(password) {
//   var salt = generateSalt(SaltLength);
//   var hash = md5(password + salt);
//   return salt + hash;
// }
 
// function validateHash(hash, password) {
//   var salt = hash.substr(0, SaltLength);
//   var validHash = salt + md5(password + salt);
//   return hash === validHash;
// }
 
// function generateSalt(len) {
//   var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
//       setLen = set.length,
//       salt = '';
//   for (var i = 0; i < len; i++) {
//     var p = Math.floor(Math.random() * setLen);
//     salt += set[p];
//   }
//   return salt;
// }
 
// function md5(string) {
//   return crypto.createHash('md5').update(string).digest('hex');
// }

// Nodejs encryption with CTR
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
 
var hw = encrypt("hello world")
// outputs hello world
console.log(decrypt(hw));

module.exports = {
  'encrypt': encrypt, //takes password in
  'decrypt': decrypt //takes hash and password
};