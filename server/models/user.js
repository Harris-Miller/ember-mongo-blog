'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoToJsonApi = require('../util/mongoToJsonApi');

const userSchema = new Schema({
  email: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  picture: { type: String },
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
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

userSchema.pre('save', function (next) {
  this.updated = new Date(); // eslint-disable-line no-invalid-this
  next();
});

/*
 *
 * @method toJsonApi
 * @param {User|Array[User]} users can be a single user object or array of user objects
 * @return {Object} returns the collection in the JsonApi format
 */
userSchema.statics.toJsonApi = function (users) {
  return mongoToJsonApi(
    users,
    'User',
    [
      { field: 'articles', type: 'Article' },
      { field: 'comments', type: 'Comment' }
    ]
  );
};

module.exports = mongoose.model('User', userSchema);
