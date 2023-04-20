const nodemailer = require('../config/nodemailer');

// sends mail to the user
exports.forgotPassword = async (senderMail, link) => {
    console.log('inside forgot mailer', link);

   nodemailer.transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>',
        to: senderMail,
        subject: "Forgot Password - reset link",
        html: `
            <h1> Reset Password </h1>
            <p>
                <a href="${link}">Click Here</a> to reset password
                ${link}
            </p>    
        `
    }, (err , info) => {
        if(err) {console.log('Error in sending mail', err)
        return;
    }
        console.log('Message sent', info);
        return;
    })
}