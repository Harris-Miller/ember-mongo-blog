'use strict';

const mongoose = require('mongoose');
// set mongose to use native promises
mongoose.Promise = global.Promise;

const User = require('./models/user');
const Article = require('./models/article');
const Comment = require('./models/comment');

const mongo = {
  connect() {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ember-mongo-blog');
  },

  user: {
    create({ email, firstname, lastname, picture }) {
      const newUser = new User({
        email,
        firstname,
        lastname,
        picture
      });

      return newUser.save().then(() => User.toJsonApi(newUser));
    },
    read({ id, ids, email }) {
      const query = {};
      let queryType;

      // for coalesce find requests
      if (ids && Array.isArray(ids)) {
        query._id = { $in: ids };
        queryType = 'find';
      } else if (email) {
        query.email = email;
        queryType = 'findOne';
      } else if (id) {
        query._id = id;
        queryType = 'findOne';
      } else {
        queryType = 'find';
      }

      return User[queryType](query)
        .then(users => {
          if (!users) {
            return { data: null };
          }
          return User.toJsonApi(users);
        });
    },
    update() {

    },
    delete(id) {
      // TODO: clean this up, must be a better way to go about it
      return User.findByIdAndRemove(id)
        .then(removedUser => {
          // if removedArticle is null here, then it was not found!
          if (!removedUser) {
            const err = new Error(`User "${id}" not found!`);
            err.status = 404;
            throw err;
          }

          // first, remove all the articles from this user, and all comments for the articles
          return Article.remove({ _id: { $in: removedUser.articles } })
            .then(removedArticles => {
              // remove all comments for all removed Articles
              const allComments = removedArticles.reduce((comments, removedArticle) => comments.concat(removedArticle.comments), []);
              return Comment.remove({ _id: { $in: allComments } });
            })
            .then(removedComments => {
              // remove references from users (no need to remove references to articles, as we just removed it)
              return Promise.all(removedComments.map(removedComment => {
                // for all removedComments, remove ref from User
                return User.findByIdAndUpdate(removedComment.author, {
                  $pull: { comments: removedComment._id }
                }).exec();
              }));
            })
            .then(() => {
              // then, remove any left over comments from that user that didn't get removed from being a part of a removed article
              return Comment.remove({ _id: { $in: removedUser.comments } });
            })
            .then(removedComments => {
              // and remove refs to articles for removed comments
              return Promise.all(removedComments.map(removedComment => {
                return Article.findByIdAndUpdate(removedComment.article, {
                  $pull: { comments: removedComment._id }
                }).exec();
              }));
            });
        });
    }
  },

  article: {
    create({ title, body, author }) {
      const newArticle = new Article({
        title,
        body,
        author
      });

      return newArticle.save()
        .then(() => {
          return User.findByIdAndUpdate(newArticle.author, {
            $addToSet: { articles: newArticle._id }
          });
        })
        .then(() => Article.toJsonApi(newArticle));
    },
    read({ id, ids }) {
      const query = {};
      let queryType;

      // for coalesce find requests
      // e.g. /articles?filter[id]=123abc,456def
      if (ids && Array.isArray(ids)) {
        query._id = { $in: ids };
        queryType = 'find';
      } else if (id) {
        query._id = id;
        queryType = 'findOne';
      } else {
        queryType = 'find';
      }

      return Article[queryType](query)
        .then(articles => {
          if (!articles) {
            return { data: null };
          }
          return Article.toJsonApi(articles);
        });
    },
    update(id, { title, body }) {
      return Article.findByIdAndUpdate(
        id,
        {
          $set: {
            title,
            body,
            updated: new Date()
          }
        },
        { new: true } // { new: true} will make mongoose return the updated document, and not the original
      ).then(updatedArticle => Article.toJsonApi(updatedArticle));
    },
    delete(id) {
      return Article.findByIdAndRemove(id)
        .then(removedArticle => {
          // if removedArticle is null here, then it was not found!
          if (!removedArticle) {
            const err = new Error(`Article "${id}" not found!`);
            err.status = 404;
            throw err;
          }

          // remove reference from the author
          const authorPromise = User.findByIdAndUpdate(removedArticle.author, {
            $pull: { articles: removedArticle._id }
          }).exec();

          // and remove all comments for the article
          const commentsPromise = Comment.remove({ _id: { $in: removedArticle.comments } })
            .then(removedComments => {
              // remove references from users (no need to remove references to articles, as we just removed it)
              return Promise.all(removedComments.map(removedComment => {
                // for all removedComments, remove ref from User
                return User.findByIdAndUpdate(removedComment.author, {
                  $pull: { comments: removedComment._id }
                }).exec();
              }));
            });

          return Promise.all([authorPromise, commentsPromise]);
        });
    }
  },

  comment: {
    create({ text, author, article }) {
      const newComment = new Comment({
        text,
        author,
        article
      });

      return newComment.save()
        .then(() => {
          // update newComment's belongsTo for the use and article
          const userPromise = User.findByIdAndUpdate(newComment.author, {
            $addToSet: { comments: newComment._id }
          });

          const articlePromise = Article.findByIdAndUpdate(newComment.article, {
            $addToSet: { comments: newComment._id }
          });

          return Promise.all([userPromise, articlePromise]);
        })
        .then(() => Comment.toJsonApi(newComment));
    },
    read({ id, ids }) {
      const query = {};
      let queryType;

      // for coalesce find requests
      if (ids && Array.isArray(ids)) {
        query._id = { $in: ids };
        queryType = 'find';
      } else if (id) {
        query._id = 'findOne';
      } else {
        queryType = 'find';
      }

      return Comment[queryType](query)
        .then(comments => {
          if (!comments) {
            return { data: null }
          }

          return Comment.toJsonApi(comments);
        }, {
          new: true // { new: true} will make mongoose return the updated document, and not the original
        }).then(updateComment => Comment.toJsonApi(updateComment));
    },
    update({ author, text }) {
      return Comment.findByIdAndUpdate(id, {
        $set: {
          text: text,
          updated: new Date()
        }
      });
    },
    delete(id) {
      return Comment.findByIdAndRemove(id)
        .then(removedComment => {
          // if removedComment is null here, then it was not fuond!
          if (!removedComment) {
            const err = new Error(`Comment "${id}" not found!`);
            err.status = 404;
            throw err;
          }

          // remove references
          const userPromise = User.findByIdAndUpdate(removedComment.author, {
            $pull: { comments: removedComment._id }
          }).exec();

          const articlePromise = Article.findByIdAndUpdate(removedComment.article, {
            $pull: { comments: removedComment._id }
          }).exec();

          return Promise.all([userPromise, articlePromise]);
        });
    }
  }
};

module.exports = mongo;
