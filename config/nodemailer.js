const nodemailer = require('nodemailer');


// temporary mailing service is used to send and recieve mails.
var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "ccbccec58548d6",
      pass: "6b22392dae3cb1"
    }
  });

module.exports = {
    transporter: transporter
}