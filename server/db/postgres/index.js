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
    const sequalize = new Sequelize('blog', 'postgres', null, {
      host: 'localhost',
      port: 5433,
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
      return Promise.resolve({
        test: 'I am a test'
      });
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
        return postgresToJsonApi.user(users);
      });
    }
  }
};

module.exports = postgres;
