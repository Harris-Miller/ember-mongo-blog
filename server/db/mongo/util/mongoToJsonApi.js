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
function mongooseModelToJsonApiModel(doc, dataType, relationships) {
  // mongoose model toJSON
  // console.log(doc);
  doc = doc.toJSON();

  delete doc.__v; // we don't need mongoose's __v;

  const dataObj = {
    type: dataType,
    id: doc._id,
    relationships: {}
  };

  delete doc._id;

  for (let i = 0, l = relationships.length; i < l; i++) {
    const field = relationships[i].field;
    if (doc.hasOwnProperty(field)) {

      const relations = doc[field];
      dataObj.relationships[field] = {};

      if (Array.isArray(relations)) {
        const relationsData = dataObj.relationships[field].data = [];
        relations.forEach(r => {
          relationsData.push({
            type: relationships[i].type,
            id: r
          });
        });
      } else {
        dataObj.relationships[field].data = {
          type: relationships[i].type,
          id: relations
        };
      }

      delete doc[relationships[i].field];
    }
  }

  dataObj.attributes = doc;

  return dataObj;
}

module.exports = function (mongoDoc, dataType, relationships) {
  const jsonApi = {
    data: []
  };

  // if mongoDoc is a single doc
  if (!Array.isArray(mongoDoc)) {
    // run it through the transformer and set it as jsonApi.data
    jsonApi.data = mongooseModelToJsonApiModel(mongoDoc, dataType, relationships);
  } else {
    //run each of them through the transformer, pushing them only jsonApi.data
    mongoDoc.forEach(doc => {
      jsonApi.data.push(mongooseModelToJsonApiModel(doc, dataType, relationships));
    });
  }

  return jsonApi;
};
