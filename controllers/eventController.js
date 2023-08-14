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

module.exports = {
  createEvent,
};
