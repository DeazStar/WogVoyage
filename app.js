const express = require('express');
const morgan = require('morgan');
const eventRouter = require('./routes/eventRouter');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/events', eventRouter);

module.exports = app;
