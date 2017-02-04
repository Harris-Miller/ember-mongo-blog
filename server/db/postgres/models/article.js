'use strict';

const Sequelize = require('sequelize');

function article(sequalize, User) {
  return sequalize.define('article', {
    title: Sequelize.STRING,
    body: Sequelize.STRING,
    removed: { type: Sequelize.BOOLEAN, defaultValue: false }
  });
}

module.exports = article;
