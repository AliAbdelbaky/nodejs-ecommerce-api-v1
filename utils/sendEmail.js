/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require('nodemailer');
// NodeMailer
const sendEmail = async (options) => {
    console.log()
    // 1 create transporter (gmail || mailgun || mailtrap)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true, // true for 465, false for other ports like 587
        auth: {
            user: process.env.EMAIL_USER, // generated ethereal user
            pass: process.env.EMAIL_PASS // generated ethereal password
        }
    });
    // 2 define email options (from, to, subject, body)
    const mailOptions = {
        from: `${process.env.APP_NAME}<${process.env.EMAIL_USER}>`,
        to: `${options.email}`,
        subject: options.subject,
        text: options.message
    }
    // 3 send email
    await transporter.sendMail(mailOptions)
}
module.exports = sendEmail