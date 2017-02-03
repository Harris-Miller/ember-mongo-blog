'use strict';

const express = require('express');
const router = new express.Router();

const db = require('../../util/get-db');

// get all
router.route('/users').get((req, res, next) => {
  db.user.read({ ids: req.query.filter && req.query.filter.id, email: req.query.email })
    .then(users => {
      return res.json(users);
    })
    .catch(err => {
      err.status = 500;
      next(err);
    });
});

// create user, TODO: add security
router.route('/users').post((req, res, next) => {
  // data will come in as JsonApiu format
  const email = req.body.data.attributes.email;
  const firstname = req.body.data.attributes.firstname;
  const lastname = req.body.data.attributes.lastname;
  const picture = req.body.data.attributes.picture;

  let err;

  if (req.body.data.id) {
    err = new Error('Client-side created ids are not supported!');
    err.status = 490;
    return next(err);
  }

  if (req.body.data.type !== 'users') {
    err = new Error('Incorrect type. Must be "users"');
    err.status = 409;
    return next(err);
  }

  if (!email) {
    err = new Error('Email is required');
    err.status = 400;
    return next(err);
  }

  if (!firstname) {
    err = new Error('Firstname is required');
    err.status = 400;
    return next(err);
  }

  if (!lastname) {
    err = new Error('Lastname is required');
    err.status = 400;
    return next(err);
  }

  return db.user.create({ email, firstname, lastname, picture })
    .then(newUser => {
      res.status(201);
      return res.json(newUser);
    })
    .catch(err => {
      err.status = 500;
      next(err);
    });
});

// get by id
router.route('/users/:id').get((req, res, next) => {
  const id = req.params.id;
  let err;

  if (!id) {
    err = new Error('id is required!');
    err.status = 400;
    return next(err);
  }

  db.user.read({ id })
    .then(users => {
      return res.json(users);
    })
    .catch(err => {
      err.status = 500;
      next(err);
    });
});

module.exports = router;
