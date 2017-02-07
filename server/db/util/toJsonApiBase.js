'use strict';

/**
 * Transform a mongoose model into a json api model for api returns
 *
 * @method mongooseModelToJsonApiModel
 * @param {MongooseModel} doc a MongooseModel
 * @param {String} the mondel's type as a string (TODO: can we get this off of doc?)
 * @param {Array} relationships an array describing the relationships of the model
 * @param {String} relationships[].field the key of the doc field that is a relationship
 * @params {String} relationships[].type the model name of that relationship
 */
function modelToJsonApiModelBase(doc, dataType, relationships, buildDataObj, buildRelationsObj) {
  doc = doc.toJSON();

  const dataObj = buildDataObj(doc, dataType);

  for (let i = 0, l = relationships.length; i < l; i++) {
    const field = relationships[i].field;
    if (doc.hasOwnProperty(field)) {
      const relations = doc[field];
      dataObj.relationships[field] = {};

      if (Array.isArray(relations)) {
        const relationsData = dataObj.relationships[field].data = [];
        relations.forEach(r => {
          relationsData.push(buildRelationsObj(relationships[i].type, r));
        });
      } else {
        dataObj.relationships[field].data = buildRelationsObj(relationships[i].type, relations);
      }

      delete doc[relationships[i].field];
    }
  }

  dataObj.attributes = doc;

  return dataObj;
}

module.exports = function (dbDoc, dataType, relationships, buildDataObj, buildRelationsObj) {
  const jsonApi = {
    data: []
  };

  // if mongoDoc is a single doc
  if (!Array.isArray(dbDoc)) {
    // run it through the transformer and set it as jsonApi.data
    jsonApi.data = modelToJsonApiModelBase(dbDoc, dataType, relationships, buildDataObj, buildRelationsObj);
  } else {
    //run each of them through the transformer, pushing them only jsonApi.data
    dbDoc.forEach(doc => {
      jsonApi.data.push(modelToJsonApiModelBase(doc, dataType, relationships, buildDataObj, buildRelationsObj));
    });
  }

  return jsonApi;
};
