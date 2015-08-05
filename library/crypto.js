var crypto = require('crypto');

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = '#f)1_be&p,{589<,{T9;X[=z';

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

module.exports = {
  'encrypt': encrypt, //takes password in
  'decrypt': decrypt //takes hash and password
};