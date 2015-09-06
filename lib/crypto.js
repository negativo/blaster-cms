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

var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);



module.exports = {
  'encrypt': encrypt, //takes string in
  'decrypt': decrypt, //takes hash and string
  bcrypt:{
    encrypt:function(pwd){
      return bcrypt.hashSync(pwd, salt);
    },
    compare:function(pwd,hash){
      return bcrypt.compareSync(pwd, hash); // true/false
    }
  }
};