var nodemailer = require('nodemailer');
var dotenv     = require('dotenv').load;

var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
var templateDir = path.join(__dirname, '..', '..', 'admin', 'emails','reset-password');



var smtpConfig = {
    host: process.env.MAIL_HOST,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PWD,
    },
};

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpConfig);

// setup e-mail data with unicode symbols

exports.sendmail = function(mail, callback){
    var resetPasswordEmail = new EmailTemplate(templateDir);
    resetPasswordEmail.render({ link: mail.link, sitename: process.env.SITENAME, subtitle: process.env.SITESUBTITLE }, function(err,res){
        var mailOptions = {
            from: process.env.SITENAME, // sender address
            to: mail.to, // list of receivers
            subject: process.env.SITENAME + ' Password Reset', // Subject line
            html: res.html,
        };
        return transporter.sendMail(mailOptions, function(error, info){
          if(error){
              console.log(error);
              callback(err);
          }
          callback(null, "reset mail sent");
        });
    });
}