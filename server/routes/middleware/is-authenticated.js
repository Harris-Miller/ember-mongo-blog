'use strict';

function isAuthenticated(req, res, next) {
  // TODO: check if header Authenticated exists and has a bearer token in it
  next();
}

module.exports = isAuthenticated;
