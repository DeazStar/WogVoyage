/* eslint-disable import/no-import-module-exports */
/* eslint-disable import/no-extraneous-dependencies */
import mongoose from 'mongoose';
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

const User = mongoose.model('User', userSchema);

export default User;
