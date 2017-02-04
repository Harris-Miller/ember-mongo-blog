'use strict';

function reset(user, article, comment) {
  // create some defaults
  return Promise.all([
    user.create({
      email: 'harrismiller08@gmail.com',
      firstname: 'Harris',
      lastname: 'Miller'
    }),
    user.create({
      email: 'john.doe@gmail.com',
      firstname: 'John',
      lastname: 'Doe'
    })
  ])
  .then(([user1, user2]) => {
    return Promise.all([
      Promise.resolve(user1),
      Promise.resolve(user2),
      article.create({
        title: 'Article 1',
        body: '#header1',
        userId: user1.getDataValue('id')
      }),
      article.create({
        title: 'Article 2',
        body: 'number two',
        userId: user2.getDataValue('id')
      })
    ]);
  }).then(([user1, user2, article1, article2]) => {
    return Promise.all([
      comment.create({
        text: 'wtf',
        userId: user1.getDataValue('id'),
        articleId: article1.getDataValue('id')
      })
    ]);
  });
}

module.exports = reset;
