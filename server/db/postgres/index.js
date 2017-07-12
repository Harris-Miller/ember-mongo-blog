'use strict';

const Sequelize = require('sequelize');
const userFactory = require('./models/user');
const articleFactory = require('./models/article');
const commentFactory = require('./models/comment');
const postgresToJsonApi = require('./util/postgresToJsonApi');

let user;
let article;
let comment;

const postgres = {
  connect() {
    const sequalize = new Sequelize('blog', 'harris', null, {
      host: 'localhost',
      port: 5432,
      dialect: 'postgres',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    });

    user = userFactory(sequalize);
    article = articleFactory(sequalize);
    comment = commentFactory(sequalize);

    // build associations
    user.hasMany(article);
    article.belongsTo(user);

    user.hasMany(comment);
    comment.belongsTo(user);

    article.hasMany(comment);
    comment.belongsTo(article);

    if (process.env.RESET_DB) {
      return sequalize.sync({ force: true }).then(() => {
        return require('./reset')(user, article, comment);
      });
    }

    return sequalize.sync();
  },

  user: {
    create({ email, firstname, lastname, picture }) {
      return user.create({
        email,
        firstname,
        lastname,
        picture
      })
      .then(postgresToJsonApi.user);
    },
    read({ id, ids, email }) {
      const query = {
        include: [{ model: article, attributes: ['id'] }, { model: comment, attributes: ['id'] }]
      };
      let queryType;

      // for coalesce find requests

      if (ids && Array.isArray(ids)) {
        query.where = {
          id: { in: ids }
        };
        queryType = 'findAll';
      } else if (email) {
        query.where = {
          email
        };
        queryType = 'findOne';
      } else if (id) {
        query.where = {
          id
        };
        queryType = 'findOne';
      } else {
        queryType = 'findAll';
      }

      return user[queryType](query).then(users => {
        if (!users) {
          return { data: null };
        }
        
        return postgresToJsonApi.user(users);
      });
    },
    update() {
      // TODO
      throw new Error('User update not yet implemented!');
    },
    delete(id) {
      return user.destroy({ where: { id } })
        .then(numDeletedUsers => {
          // numDeletedUsers should only be 0 or 1
          // if 0, user could not be found
          // if 1, user was found and deleted
          if (!numDeletedUsers) {
            const err = new Error(`User "${id}" not found!`);
            err.status = 404;
            throw err;
          }

          return numDeletedUsers;
        });
    }
  },

  article: {
    create({ title, body, author}) {
      return article.create({
        title, body, author
      }).then(postgresToJsonApi.article)
    },
    read({ id, ids }) {
      const query = {};
      let queryType;

      // for coalesce find requests
      if (ids && Array.isArray(ids)) {
        query.where = {
          id: { in: ids }
        };
        queryType = 'findAll';
      } else if (id) {
        query.where = { id };
        queryType = 'findOne';
      } else {
        queryType = 'findAll';
      }

      return article[queryType](query)
        .then(postgresToJsonApi.article);
    },
    update(id, { title, body }) {

    },
    delete(id) {
      return article.destroy({ where: { id } });
    }
  },

  comment: {
    create({ text, author, article }) {
      return comment.create({
        title, body, author
      }).then(postgresToJsonApi.comment);
    },
    read({ id, ids }) {
      const query = {};
      let queryType;

      // for coalesce find requests
      if (ids && Array.isArray(ids)) {
        query.where = { id: { in: ids } };
        queryType = 'findAll';
      } else if (id) {
        query.where({ id });
        queryType = 'FindOne';
      } else {
        queryType = 'FindAll';
      }

      return comment[queryType](query)
        .then(postgresToJsonApi.comment);
    },
    update(id, { text }) {

    },
    delete(id) {
      return comment.destory({ where: { id } });
    }
  }
};

module.exports = postgres;
