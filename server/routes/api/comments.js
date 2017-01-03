'use strict';

const express = require('express');
const router = new express.Router();
const User = require('../../models/user');
const Article = require('../../models/article');
const Comment = require('../../models/comment');

// get all
router.route('/comments').get((req, res, next) => {
  let query = {};

  // for coalesce find requests
  // e.g. /comments?filter[id]=123abc,456def
  if (req.query.filter && req.query.filter.id) {
    const ids = req.query.filter.id.split(',');
    query = { _id: { $in: ids } };
  }

  Comment.find(query)
    .then(comments => {
      res.json(Comment.toJsonApi(comments));
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

  const newComment = new Comment({
    text,
    author,
    article
  });

  return newComment.save()
    .then(() => {
      // update newComment's belongsTo for the use and article
      const userPromise = User.findByIdAndUpdate(newComment.author, {
        $addToSet: { 'comments': newComment._id }
      });

      const articlePromise = Article.findByIdAndUpdate(newComment.article, {
        $addToSet: { 'comments': newComment._id }
      });

      return Promise.all([userPromise, articlePromise]).then(() => {
        res.status(201);
        res.json(Comment.toJsonApi(newComment));
      });
    }).catch(err => {
      err.status = 500;
      next(err);
    });
});

// get single
router.route('/comments/:id').get((req, res, next) => {
  const id = req.params.id;

  if (!id) {
    const err = new Error('Id is required!');
    err.status = 400;
    return next(err);
  }

  return Comment.findById(id)
    .then(comment => {
      if (!comment) {
        const err = new Error(`Comment "${id}" not found!`);
        err.status = 404;
        return next(err);
      }

      res.json(Article.toJsonApi(comment));
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

  return Comment.findByIdAndUpdate(id, {
    $set: {
      text: attributes.text,
      updated: new Date()
    }
  }, {
    new: true // { new: true} will make mongoose return the updated document, and not the original
  }).then(updatedComment => {
    res.json(Comment.toJsonApi(updatedComment));
  }).catch(err => {
    err.status = 500;
    next(err);
  });
});

// remove single
router.route('/comments/:id').delete((req, res, next) => {
  // TODO
  next();
});

module.exports = router;
