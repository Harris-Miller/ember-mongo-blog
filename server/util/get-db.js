'use strict';

const dbConfig = require('../config/database');

const db = require(`../db/${dbConfig.database}`);

module.exports = db;
