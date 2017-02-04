'use strict';

const toJsonApiModelBase = require('../../util/toJsonApiBase');

function buildDataObj(doc, dataType) {
  const dataObj = {
    type: dataType,
    id: doc.id,
    relationships: {}
  };

  delete doc.id;

  return dataObj;
}

function buildRelationsObj(type, idObject) {
  return {
    type,
    id: idObject.id
  };
}

function postgressModelToJsonApiModel(doc, dataType, relationships) {
  return toJsonApiModelBase(doc, dataType, relationships, buildDataObj, buildRelationsObj);
}

module.exports = {
  user(users) {
    return postgressModelToJsonApiModel(
      users,
      'User',
      [
        { field: 'articles', type: 'Article' },
        { field: 'comments', type: 'Comment' }
      ]
    );
  },
  article(articles) {
    return postgressModelToJsonApiModel(
      articles,
      'Article',
      [
        { field: 'author', type: 'User' },
        { field: 'comments', type: 'Comment' }
      ]
    );
  },
  comment(comments) {
    return postgressModelToJsonApiModel(
      comment,
      'Comment',
      [
        { field: 'author', type: 'User' },
        { field: 'article', type: 'Article' }
      ]
    );
  }
};
