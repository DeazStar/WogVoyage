/* eslint-disable import/extensions */
import Event from '../models/eventModel.js';
import catchAsync from '../errors/catchAsync.js';

const createEvent = catchAsync(async (req, res, next) => {
  const event = await Event.create(req.body);

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
  const events = await Event.find();

  res.status(200).json({
    status: 'success',
    data: {
      events,
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

export default { createEvent, deleteEvent, getAllEvents, updateEvent };
