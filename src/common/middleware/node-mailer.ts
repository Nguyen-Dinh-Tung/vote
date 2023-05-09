'use strict';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();
// async..await is not allowed in global scope, must use a wrapper
async function nodeMailerMain(email: string, message: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 's30.tung@gmail.com',
      pass: 'hmsxtipdireojutk',
    },
  });
  // send mail with defined transport object
  await transporter.sendMail({
    from: 's30.tung@gmail.com', // sender address
    to: email, // list of receivers
    subject: 'Hello ✔', // Subject line
    text: message, // plain text body
    html: `<b>${message}</b>`, // html body
  });
}

export default nodeMailerMain;
