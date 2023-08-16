/* eslint-disable import/extensions */
import nodemailer from 'nodemailer';
import catchAsync from '../errors/catchAsync.js';

const sendEmail = catchAsync(async (option) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail(option);
});

export default sendEmail;
