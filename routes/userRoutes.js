/* eslint-disable import/extensions */
import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.route('/signup').post(authController.signup);

router.route('/login').post(authController.login);

router.route('/verifyEmail/:token').patch(authController.verifyEmail);
export default router;
