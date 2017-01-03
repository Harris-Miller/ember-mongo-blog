'use strict';

const express = require('express');
// const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
// set mongose to use native promises
mongoose.Promise = global.Promise;

const makeErrorObject = require('./util/make-error-object');

const app = express();

mongoose.connect('mongodb://localhost/ember-mongo-blog');

app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// setup HTTP headers
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:4200'); // TODO: variable this for all environments
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  // res.set('Content-Type', 'application/vnd.api+json');
  res.set('x-api-version', '1.0.0');
  next();
});

// all json should be pretty print 2 spaces
app.set('json spaces', 2);

// add auth route
app.use('/auth', require('./routes/auth'));
// and api routes
app.use(require('./routes/api'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err.stack);
  res.json(makeErrorObject(err));
});

module.exports = app;
