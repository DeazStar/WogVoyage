/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import catchAsync from '../errors/catchAsync.js';

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  console.log(token);

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

  createSendToken(user, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  res.status(200).json();
});

export default { signup, login };
