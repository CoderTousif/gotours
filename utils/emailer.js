const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    // define email options
    const mailOptions = {
        from: 'Tousif <testing@tousif.io>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    //send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;