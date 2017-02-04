'use strict';

const toJsonApiModelBase = require('../../util/toJsonApiBase');

function buildDataObj(doc, dataType) {
  delete doc.__v; // we don't need mongoose's __v;

  const dataObj = {
    type: dataType,
    id: doc.id,
    relationships: {}
  };

  delete doc._id;

  return dataObj;
}

function buildRelationsObj(type, idObject) {
  return {
    type,
    id: idObject
  };
}

function postgressModelToJsonApiModel(doc, dataType, relationships) {
  return toJsonApiModelBase(doc, dataType, relationships, buildDataObj, buildRelationsObj);
}

module.exports = postgressModelToJsonApiModel;
