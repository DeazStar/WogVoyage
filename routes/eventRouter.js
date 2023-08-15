/* eslint-disable import/extensions */
/* eslint-disable import/no-import-module-exports */
import express from 'express';
import eventController from '../controllers/eventController.js';

const router = express.Router();

router
  .route('/')
  .get(eventController.getAllEvents)
  .post(eventController.createEvent);

router
  .route('/:id')
  .patch(eventController.updateEvent)
  .delete(eventController.deleteEvent);

export default router;
