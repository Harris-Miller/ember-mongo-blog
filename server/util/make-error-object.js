'use strict';

const uuid = require('uuid');

/**
 * create an error object to match jsonapi spec (http://jsonapi.org/format/#errors)
 * see that link for further implementation options
 *
 * @method makeErrorObject
 * @param {Error} err the error object to convert
 * @return {Object}
 */
function makeErrorObject(err) {
  return {
    errors: [{
      id: uuid.v1(), // this is usefull for logging!
      status: `${err.status}`, // jsonapi wants this to be a string value
      //code: 'TODO' // this will be application specific code that we can implement if we want
      details: err.message
    }]
  };
}

module.exports = makeErrorObject;
