import nodeMailer from 'nodemailer';
import { env } from './env.js';

import { SMTP } from '../constants/index.js';

export const transporter = nodeMailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: env(SMTP.SMTP_PORT),
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
});

const sendMail = async (options) => {
  return await transporter.sendMail(options, function (error, info) {
    if (error) {
      console.log('Nodemailer Transport - SendMail - Error:' + error);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });
};
export default sendMail;
