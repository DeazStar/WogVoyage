/* eslint-disable import/no-import-module-exports */
/* eslint-disable import/no-extraneous-dependencies */
import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'User must have first name'],
    validate: [validator.isAlpha, 'Please provide your real first name'],
  },
  lastName: {
    type: String,
    required: [true, 'User must have last name'],
    validate: [validator.isAlpha, 'Please provide your real last name'],
  },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  emailStatus: {
    type: String,
    default: 'unverified',
  },
  emailVerificationToken: {
    type: String,
    select: false,
  },
  emailVerificationTokenExpiresIn: {
    type: Date,
    select: false,
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    min: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (pass) {
        return this.password === pass;
      },
      message: 'password should be the same',
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  country: {
    type: String,
    default: 'Ethiopia',
    enum: ['Ethiopia'],
  },
  city: {
    type: String,
    required: [true, 'Please provide your city'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide your phone number'],
  },
});

const createToken = function () {
  const token = crypto.randomBytes(32).toString('hex');

  return token;
};

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.checkPassword = async function (
  inputPassword,
  userPassword,
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.methods.generateEmailVerificationToken = function () {
  const token = createToken();

  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.emailVerificationTokenExpiresIn = Date.now() + 10 * 60 * 1000;

  return token;
};

const User = mongoose.model('User', userSchema);
export default User;
