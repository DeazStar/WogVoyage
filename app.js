const express = require('express');
const morgan = require('morgan');
const eventRouter = require('./routes/eventRouter');
const globalErrorHandler = require('./errors/errorHandler');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/events', eventRouter);

app.use(globalErrorHandler);

module.exports = app;
