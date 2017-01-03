'use strict';

module.exports = function (req, res, next) {

  const contentTypes = req.get('Content-Type').split(';');

  if (!contentTypes.some(element => element === 'application/vnd.api+json')) {
    const err = new Error('Unsupported Content-Type. Must be "application/vnd.api+json"');
    err.status = 415;
    return next(err);
  }

  return next();
};
