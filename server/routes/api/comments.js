'use strict';

const express = require('express');
const router = new express.Router();
const User = require('../../db/mongo/models/user');
const Article = require('../../db/mongo/models/article');
const Comment = require('../../db/mongo/models/comment');

// get all
router.route('/comments').get((req, res, next) => {
  db.comment.read({ ids: req.query.filter && req.query.filter.id })
    .then(comments => {
      res.json(comments);
    })
    .catch(err => {
      err.status = 500;
      next(err);
    });
});

// create
router.route('/comments').post((req, res, next) => {
  const attributes = req.body.data.attributes;
  const relationships = req.body.data.relationships;

  const text = attributes.text;
  const author = relationships.author.data.id;
  const article = relationships.article.data.id;

  if (req.body.data.id) {
    const err = new Error('Client-side created ids are not supported!');
    err.status = 409;
    return next(err);
  }

  if (req.body.data.type !== 'comments') {
    const err = new Error('Incorrect type. Must by "comments"');
    err.status = 409;
    return next(err);
  }

  if (!text) {
    const err = new Error('Cannot submit an empty comment!');
    err.status = 400;
    return next(err);
  }

  if (!author) {
    const err = new Error('Author is required!');
    err.status = 400;
    return next(err);
  }

  if (!article) {
    const err = new Error('A comment must be attached to an article!');
    err.status = 400;
    return next(err);
  }

  return db.article.create({ text, author, article })
    .then(newComment => {
      res.status(201);
      res.json(newComment);
    })
    .catch(error => {
      error.status = 500;
      next(error);
    });
});

// get single
router.route('/comments/:id').get((req, res, next) => {
  const id = req.params.id;

  db.comment.read({ id })
    .then(comment => {
      res.json(comment);
    }).catch(err => {
      err.status = 500;
      next(err);
    });
});

// update single
router.route('/comments/:id').patch((req, res, next) => {
  const id = req.params.id;

  if (!id) {
    const err = new Error('Id is required!');
    err.status = 400;
    return next(err);
  }

  const attributes = req.body.data.attributes;
  const relationships = req.body.data.relationships;
  const text = attributes.text;
  const authorId = relationships.author.data.id;

  if (authorId !== req.session.user) {
    const err = new Error(`You do not have permission to update comment ${id}`);
    err.status = 401;
    return next(err);
  }

  if (!text) {
    const err = new Error('Cannot submit an empty comment!');
    err.status = 400;
    return next(err);
  }

  return db.comment.update({ author, text })
    .then(updatedComment => {
      res.json(updatedComment);
    }).catch(err => {
      err.status = 500;
      next(err);
    });
});

// remove single
router.route('/comments/:id').delete((req, res, next) => {
  const id = req.params.id;

  db.comment.delete(id)
    .then(() => {
      res.status(204);
      res.end();
    })
    .catch(err => {
      err.status || (err.status = 500);
      next(err);
    });
});

module.exports = router;
