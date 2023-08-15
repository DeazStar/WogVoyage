/* eslint-disable import/extensions */
import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.route('/signup').post(authController.signup);

export default router;
