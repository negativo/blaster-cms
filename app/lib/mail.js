var nodemailer = require('nodemailer');
var dotenv     = require('dotenv').load;

var smtpConfig = {
    host: 'smtp.gmail.com',
    auth: {
        user: 'simonecorsi.rm@gmail.com',
        pass: 'rqghsvltlvxzvlwo'
    }
};

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpConfig);

// setup e-mail data with unicode symbols

exports.sendmail = function(mail, callback){
    var mailOptions = {
        from: process.env.SITENAME, // sender address
        to: mail.to, // list of receivers
        subject: process.env.SITENAME + ' Password Reset', // Subject line
        html: '<h3> Follow the link to reset your password</h3> <p>It expires in 30min</p><p> <a href="' + mail.link + '"> '+ mail.link + ' </a> </p>' // html body
    };
	return transporter.sendMail(mailOptions, function(error, info){
	  if(error){
	      console.log(error);
          callback(err);
	  }
	  callback(null, "reset mail sent");
	});
}