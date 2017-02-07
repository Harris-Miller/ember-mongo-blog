'use strict';

const Sequelize = require('sequelize');
const standardConfig = require('./standard-config');

function user(sequalize) {
  return sequalize.define('user', {
    email: Sequelize.STRING,
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    picture: Sequelize.STRING,
    active: { type: Sequelize.BOOLEAN, defaultValue: true }
  }, standardConfig);
}

module.exports = user;
