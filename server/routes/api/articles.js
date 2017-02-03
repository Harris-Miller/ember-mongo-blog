'use strict';

const express = require('express');
const router = new express.Router();
const Article = require('../../db/mongo/models/article');

const db = require('../../util/get-db');

// get all
router.route('/articles').get((req, res, next) => {
  db.article.read({ ids: req.query.filter && req.query.filter.id })
    .then(articles => {
      res.json(articles);
    }).catch(err => {
      err.status = 500;
      next(err);
    });
});

// create
router.route('/articles').post((req, res, next) => {
  // data will come in as JsonApi format
  const attributes = req.body.data.attributes;
  const relationships = req.body.data.relationships;

  const title = attributes.title;
  const body = attributes.body;
  const author = relationships.author.data.id;

  let err;

  if (req.body.data.id) {
    err = new Error('Client-Side created ids are not supported!');
    err.status = 409;
    return next(err);
  }

  if (req.body.data.type !== 'articles') {
    err = new Error('Incorrect type. Must be "articles"');
    err.status = 409;
    return next(err);
  }

  if (!title) {
    err = new Error('Title is required!');
    err.status = 400;
    return next(err);
  }

  if (!body) {
    err = new Error('Body is required!');
    err.status = 400;
    return next(err);
  }

  if (!author) {
    err = new Error('Author is required!');
    err.status = 400;
    return next(err);
  }

  return db.article.create({ title, body, author })
    .then(newArticle => {
      res.status(201);
      res.json(Article.toJsonApi(newArticle));
    })
    .catch(error => {
      error.status = 500;
      next(error);
    });
});

// get single
router.route('/articles/:id').get((req, res, next) => {
  const id = req.params.id;

  db.article.read({ id })
    .then(articles => {
      res.json(articles);
    }).catch(err => {
      err.status = 500;
      next(err);
    });
});

// update single
router.route('/articles/:id').patch((req, res, next) => {
  const id = req.params.id;

  const attributes = req.body.data.attributes;
  const title = attributes.title;
  const body = attributes.body;

  // TODO: authorize that the owner of the article is the current user
  db.article.update(id, { title, body })
    .then(articles => {
      res.json(articles);
    }).catch(err => {
      err.status = 500;
      next(err);
    });
});

// delete single
router.route('/articles/:id').delete((req, res, next) => {
  const id = req.params.id;

  // TODO: authorize that current user owns the article
  db.article.delete(id).then(() => {
    res.status(204);
    res.end();
  }).catch(err => {
    err.status || (err.status = 500);
    next(err);
  });
});

module.exports = router;
