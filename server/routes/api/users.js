'use strict';

const express = require('express');
const router = new express.Router();
const User = require('../../models/user');

// get all
router.route('/users').get((req, res, next) => {
  let query = {};
  let queryType = 'find';

  // for coalesce find requests
  if (req.query.filter && req.query.filter.id) {
    const ids = req.query.filter.id.split(',');
    query = { _id: { $in: ids } };
  } else if (req.query.email) {
    query = { email: req.query.email };
    queryType = 'findOne';
  }

  User[queryType](query)
    .then(users => {
      if (!users) {
        return res.json({ data: null });
      }
      return res.json(User.toJsonApi(users));
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

  const newUser = new User({
    email,
    firstname,
    lastname,
    picture
  });

  return newUser.save()
    .then(() => {
      res.status(201);
      res.json(User.toJsonApi(newUser));
    })
    .catch(error => {
      error.status = 500;
      next(error);
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

  return User.findById(id)
    .then(user => {
      if (!user) {
        err = new Error(`Could not find user with id: ${id}`);
        err.status = 404;
        return next(err);
      }
      return res.json(User.toJsonApi(user));
    }).catch(error => {
      error.status = 500;
      next(error);
    });
});

module.exports = router;
