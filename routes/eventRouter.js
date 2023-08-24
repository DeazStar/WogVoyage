/* eslint-disable import/extensions */
/* eslint-disable import/no-import-module-exports */
import express from 'express';
import eventController from '../controllers/eventController.js';
import userController from '../controllers/authController.js';
import bookingRouter from './bookingRoute.js';

const router = express.Router();

router
  .route('/')
  .get(userController.protectRoute, eventController.getAllEvents)
  .post(userController.protectRoute, eventController.createEvent);

router
  .route('/:id')
  .get(eventController.getEventById)
  .patch(eventController.updateEvent)
  .delete(eventController.deleteEvent);

router.use('/:eventId/booking', bookingRouter);
export default router;
