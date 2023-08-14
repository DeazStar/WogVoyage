const Event = require('../models/eventModel');
const catchAsync = require('../errors/catchAsync');

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

module.exports = {
  createEvent,
  deleteEvent,
  getAllEvents,
};
