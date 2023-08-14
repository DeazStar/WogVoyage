const express = require('express');
const eventController = require('../controllers/eventController');

const router = express.Router();

router.route('/').post(eventController.createEvent);

module.exports = router;
