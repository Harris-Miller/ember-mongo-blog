'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = new express.Router();

// only accept jsonApi formated data
router.use(bodyParser.json({ type: 'application/vnd.api+json' }));

router.use('/api',
  require('./users'),
  require('./articles'),
  require('./comments')
);

module.exports = router;
