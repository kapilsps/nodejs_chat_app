const { urlencoded } = require('express');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');


const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    }
  });

exports.resetPasswordMail = (data) => {
  const url = process.env.APP_URL+"/reset/"+data.token+"?email="+encodeURIComponent(data.email);
  ejs.renderFile(path.join(__dirname, '..', '..', '..', 'views', 'email', 'reset-password-email.ejs'), {url}, (err, str) => {
      var mailOptions = {
        to: data.email,
        from: process.env.MAIL_FROM_ADDRESS,
        subject: 'Password Reset',
        html: str
      };
      transport.sendMail(mailOptions);
      return;
  });
}