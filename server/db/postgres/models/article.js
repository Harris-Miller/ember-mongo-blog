'use strict';

const Sequelize = require('sequelize');
const standardConfig = require('./standard-config');

function article(sequelize, User) {
  return sequelize.define('article', {
    title: Sequelize.STRING,
    body: Sequelize.STRING,
    removed: { type: Sequelize.BOOLEAN, defaultValue: false }
  }, standardConfig);
}

module.exports = article;
