const nodemailer = require("nodemailer");

let sendMail = (options) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
            }
        });

        transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: options.to,
            subject: options.subject,
            html: options.html
        });
    } catch (error) {
        console.error(error);
    }

};

module.exports = { sendMail };