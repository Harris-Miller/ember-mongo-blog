'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoToJsonApi = require('../util/mongoToJsonApi');

const commentSchema = new Schema({
  text: { type: String, required: true },
  removed: { type: Boolean, default: false },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  article: { type: Schema.Types.ObjectId, ref: 'Article' },
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

commentSchema.pre('save', function (next) {
  this.updated = new Date(); // eslint-disable-line no-invalid-this
  next();
});

/*
 *
 * @method toJsonApi
 * @param {Comment|Array[Comment]} users can be a single comment object or array of comment objects
 * @return {Object} returns the collection in the JsonApi format
 */
commentSchema.statics.toJsonApi = function (comment) {
  return mongoToJsonApi(
    comment,
    'Comment',
    [
      { field: 'author', type: 'User' },
      { field: 'article', type: 'Article' }
    ]
  );
};

module.exports = mongoose.model('Comment', commentSchema);
