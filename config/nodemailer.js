const nodemailer = require('nodemailer');


// temporary mailing service is used to send and recieve mails.
var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS
    }
  });

module.exports = {
    transporter: transporter
}