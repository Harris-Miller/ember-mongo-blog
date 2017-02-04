'use strict';

const Sequelize = require('sequelize');

function user(sequalize) {
  return sequalize.define('user', {
    email: Sequelize.STRING,
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    picture: Sequelize.STRING,
    active: { type: Sequelize.BOOLEAN, defaultValue: true }
  });
}

module.exports = user;
