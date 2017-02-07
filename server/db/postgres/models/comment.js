'use strict';

const Sequelize = require('sequelize');
const standardConfig = require('./standard-config');

function comment(sequalize, User, Article) {
  return sequalize.define('comment', {
    text: Sequelize.STRING,
    removed: { type: Sequelize.BOOLEAN, defaultValue: false }
  }, standardConfig);
}

module.exports = comment;
