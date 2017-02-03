'use strict';

const express = require('express');
const router = new express.Router();
const User = require('../../db/mongo/models/user');
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

  if (!id) {
    const err = new Error('Id is required!');
    err.status = 400;
    return next(err);
  }

  return db.article.read({ id })
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

  if (!id) {
    const err = new Error('Id is required!');
    err.status = 400;
    return next(err);
  }

  const attributes = req.body.data.attributes;
  const title = attributes.title;
  const body = attributes.body

  // TODO: authorize that the owner of the article is the current user

  db.article.update(id, { title, body })
});

// delete single
router.route('/articles/:id').delete((req, res, next) => {
  const id = req.params.id;

  if (!id) {
    const err = new Error('Id is required');
    err.status = 400;
    return next(err);
  }

  // first find the article, make sure it exists
  return Article.findById(id, (articleErr, article) => {
    if (articleErr) {
      articleErr.stauts = 500;
      return next(articleErr);
    }

    if (!article) {
      articleErr = new Error(`Article "${id}" not found!`);
      articleErr.status = 404;
      return next(articleErr);
    }

    // TODO: autherize that current user owns the article
    return db.article.delete(id);

    return Article.findByIdAndRemove(id, removeErr => {
      if (removeErr) {
        removeErr.status = 500;
        return next(removeErr);
      }

      // remove article id from User's hasMany relationship
      return User.findByIdAndUpdate(
        null, // TODO: User
        {
          $pull: { articles: id }
        },
        userErr => {
          if (userErr) {
            userErr.status = 500;
            return next(userErr);
          }

          // all done!
          res.status(204);
          return res.end();
        }
      );
    });
  });
});

module.exports = router;
