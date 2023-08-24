/* eslint-disable import/extensions */
import Features from '../lib/Features.js';
import Event from '../models/eventModel.js';
import catchAsync from '../errors/catchAsync.js';

const createEvent = catchAsync(async (req, res, next) => {
  const requestBody = { ...req.body };
  requestBody.organizer = req.user;
  const event = await Event.create(requestBody);

  res.status(201).json({
    status: 'success',
    data: {
      event,
    },
  });
});

const deleteEvent = catchAsync(async (req, res, next) => {
  await Event.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const getAllEvents = catchAsync(async (req, res, next) => {
  const queryObject = new Features(Event.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const events = await queryObject.query;

  res.status(200).json({
    status: 'success',
    data: {
      events,
    },
  });
});

const getEventById = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const event = await Event.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      event,
    },
  });
});

const updateEvent = catchAsync(async (req, res, next) => {
  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidation: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      event: updatedEvent,
    },
  });
});

export default {
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvent,
  getEventById,
};
