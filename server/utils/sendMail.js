const nodemailer = require("nodemailer");

const sendEmail = async options => {
  var transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD
    }
  });

  const mailOptions = {
    from: `Alex Kerketta <${process.env.EMAIL_FROM}>`,
    to: options.email,
    text: options.message,
    subject: options.subject
  };

  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
