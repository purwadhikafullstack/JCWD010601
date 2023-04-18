const nodemailer = require("nodemailer");

/**
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 */
const sendMail = async (to, subject, html) => {
  const { user, pass, smtp } = await nodemailer.createTestAccount();
  const { host, port, secure } = smtp;

  const transporter = nodemailer.createTransport(
    { host, port, secure, auth: { user, pass } },
    { from: `<${user}>` }
  );

  const info = await transporter.sendMail({ to, subject, html });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

module.exports = sendMail;
