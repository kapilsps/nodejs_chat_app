const nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b4add4d8d34616",
      pass: "bc4ecdd5f2c3cc"
    }
  });