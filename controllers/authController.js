/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import { promisify } from 'util';
import crypto from 'crypto';
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

  await user.hashPassword();

  const token = user.generateEmailVerificationToken();

  const message = `Verify your email address</h1> <p>to continue using WogVoyage 
  please verify that this is your email 
  address ${req.protocol}://${req.hostname}:${process.env.PORT}${req.baseUrl}/verifyEmail/${token}`;

  const mailOptions = {
    from: '<wogvoyage@gmail.com>',
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

  if (!user || !(await user.checkPassword(password)))
    return next(new AppError('incorrect email or password', 401));

  createSendToken(user, 200, res);
});

const verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  if (!token) return new AppError('Token not sent, Invalid request', 400);

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({ emailVerificationToken: hashedToken });

  if (!user)
    return next(new AppError('There is not user with this token', 404));

  if (!user.checkEmailTokenExpires())
    return next(
      new AppError('Token Expired. Please request another token', 401),
    );

  user.emailStatus = 'verified';
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiresIn = undefined;

  user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'email verified',
  });
});

const protectRoute = catchAsync(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  )
    return next(
      new AppError('You must be logged in to access this resource', 401),
    );

  const token = req.headers.authorization.split(' ')[1];

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findOne({ _id: decoded.userId });

  req.user = user;

  next();
});

const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(new AppError('Email is required', 401));

  const user = await User.findOne({ email: email });

  if (!user) return next(new AppError('There is no user with this email', 404));

  const token = user.generatePasswordRecoveryToken();

  const message = `Verify your email address</h1> <p>to continue using WogVoyage 
  please verify that this is your email 
  address ${req.protocol}://${req.hostname}:${process.env.PORT}${req.baseUrl}/recoverPassword/${token}`;

  const mailOptions = {
    from: '<wogvoyage@gmail.com>',
    to: user.email,
    subject: 'WogVoyage - Password recovery',
    text: message,
  };

  user.save({ validateBeforeSave: false });

  sendEmail(mailOptions);

  res.status(200).json({
    status: 'success',
    message: 'email sent successfully',
  });
});

const recoverPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  if (!token)
    return next(
      new AppError('to recover the password you need a recovery token', 401),
    );

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({ passwordRecoveryToken: hashedToken });

  console.log(user);

  if (!user || !user.checkPasswordRecoveryTokenExpires())
    return next(new AppError('Invalid Token or Token has expired', 404));

  const { password, passwordConfirm } = req.body;

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordRecoveryToken = undefined;
  user.passwordRecoveryTokenExpiresIn = undefined;

  if (user.password !== user.passwordConfirm)
    return new AppError('password should be the same', 401);

  await user.hashPassword();

  user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res);
});

export default {
  signup,
  login,
  verifyEmail,
  protectRoute,
  forgetPassword,
  recoverPassword,
};
