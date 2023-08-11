const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: [true, 'Event must have a name'],
  },
  eventDate: {
    type: Date,
    required: [true, 'Event must have a starting date'],
  },
  postedDate: {
    type: Date,
    default: Date.now(),
  },
  category: {
    type: [String],
    required: [true, 'Event must have at least one category'],
  },
  eventLocation: {
    type: String,
    required: [
      true,
      'Event must have a location if its an online event put online in the event location field',
    ],
  },
  summary: {
    type: String,
    required: [true, 'Event must have a summary'],
  },
  price: {
    type: Number || String,
    required: [
      true,
      'Price is required if the price is free just put Free on the price field',
    ],
    validate: {
      validator: function (data) {
        if (typeof data === 'string') {
          return data === 'Free';
        }
        return true;
      },
      message: 'if the price is free just put "Free"',
    },
  },
  organizer: {
    type: mongoose.ObjectId,
    required: [true, 'Event need an organizer'],
  },
  description: {
    type: String,
    required: [true, 'Event must have a description'],
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
