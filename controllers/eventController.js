const Event = require('../models/eventModel');

const createEvent = async (req, res, next) => {
  console.log('send***********', req.body);
  const event = await Event.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      event,
    },
  });
};

module.exports = {
  createEvent,
};
