'use strict';

const Sequelize = require('sequelize');

function comment(sequalize, User, Article) {
  return sequalize.define('comment', {
    text: Sequelize.STRING,
    removed: { type: Sequelize.BOOLEAN, defaultValue: false }
  });
}

module.exports = comment;
