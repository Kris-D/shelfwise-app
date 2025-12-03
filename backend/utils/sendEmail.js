const nodemailer = require("nodemailer");
const path = require('path');

const sendEmail = async (subject, message, send_to, send_from, reply_to) => {
  // Create Email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Define sending Email options
  const mailOptions = {
    from: send_from,
    to: send_to,
    replyTo: reply_to,
    subject: subject,
    html: message,
    attachments: [
      {
        filename: 'shelfwise-logo.png',
        path: path.join(__dirname, '../assets/shelfwise-logo.png'),
        cid: 'shelfwise-logo', // must match the cid in the HTML
      },
    ],
  };

  // Send Email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendEmail;
