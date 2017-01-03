'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = new express.Router();
const request = require('request');
const config = require('../config/google-app');

const redeemUrl = 'https://www.googleapis.com/oauth2/v4/token';

// this route should just use normal json
router.use(bodyParser.json());

router.route('/').post((req, res, next) => {
  const authorizationCode = req.body.authorizationCode;
  const form = Object.assign({}, config, { code: authorizationCode });

  request.post(redeemUrl, { form }, (error, _, body) => {
    if (error) {
      return next(error);
    }

    const tokenInfo = JSON.parse(body);

    // TODO, tokenInfo may be an error object, need to test for that

    return res.json(tokenInfo);
  });
});

// TODO: check access_token for if it's valide, and to retrieve email address of user
router.route('/check').get((req, res, next) => {
  request(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${req.query.access_token}`, (error, _, body) => {
    if (error) {
      return next(error);
    }

    return res.json(JSON.parse(body));
  });
});

module.exports = router;
