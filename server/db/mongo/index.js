'use strict';

const mongoose = require('mongoose');
// set mongose to use native promises
mongoose.Promise = global.Promise;

const User = require('./models/user');
const Article = require('./models/article');

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
    delete() {

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
            title: attributes.title,
            body: attributes.body,
            updated: new Date()
          }
        },
        { new: true } // { new: true} will make mongoose return the updated document, and not the original
      ).then(updatedArticle => Article.toJsonApi(updatedArticle));
    },
    delete(id) {
      return Article.findByIdAndRemove(id)
        .then(removedArticle => {
          console.log(removedArticle);
          return User.findByIdAndUpdate(removedArticle.author, {
            $pull: { articles: removedArticle._id }
          });
        });
    }
  }
};

module.exports = mongo;
