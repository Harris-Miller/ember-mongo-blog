'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoToJsonApi = require('../util/mongoToJsonApi');

const articleSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  removed: { type: Boolean, default: false },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
}, {
  id: false,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

articleSchema.pre('save', function (next) {
  this.updated = new Date(); // eslint-disable-line no-invalid-this
  next();
});

/*
 *
 * @method toJsonApi
 * @param {Article|Array[Article]} users can be a single artcile object or array of article objects
 * @return {Object} returns the collection in the JsonApi format
 */
articleSchema.statics.toJsonApi = function (articles) {
  return mongoToJsonApi(
    articles,
    'Article',
    [
      { field: 'author', type: 'User' },
      { field: 'comments', type: 'Comment' }
    ]
  );
};

module.exports = mongoose.model('Article', articleSchema);
