/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import AppError from '../errors/AppError.js';
import catchAsync from '../errors/catchAsync.js';
import sendEmail from '../lib/sendEmail.js';

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 1000 * 60 * 60 * 24,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOption.secure = true;
  res.cookie('jwt', token, cookieOption);

  if (process.env.NODE_ENV === 'development') {
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } else {
    res.status(statusCode).json({
      status: 'success',
      data: {
        user,
      },
    });
  }
};

const signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    city: req.body.city,
    phoneNumber: req.body.phoneNumber,
  });

  const token = user.generateEmailVerificationToken();

  const message = `Verify your email address</h1> <p>to continue using WogVoyage 
  please verify that this is your email 
  address ${req.protocol}://${req.hostname}:${process.env.PORT}${req.baseUrl}/verifyEmail/${token}`;

  const mailOptions = {
    from: '<naodararsa@gmail.com>',
    to: user.email,
    subject: 'WogVoyage - Verify your email',
    text: message,
  };

  user.save({ validateBeforeSave: false });

  await sendEmail(mailOptions);

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        emailStatus: user.emailStatus,
        role: user.role,
        country: user.country,
        city: user.city,
        phoneNumber: user.phoneNumber,
      },
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('email and password are required', 400));

  const user = await User.findOne({ email });

  if (!user || !(await user.checkPassword(password, user.password)))
    return next(new AppError('incorrect email or password', 401));

  createSendToken(user, 200, res);
});

export default { signup, login };
