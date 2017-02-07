import Ember from 'ember';
import DS from 'ember-data';
import Base from './base';

export default Base.extend({
  firstname: DS.attr('string'),
  lastname: DS.attr('string'),

  fullname: Ember.computed('firstname', 'lastname', function () {
    return `${this.get('firstname')} ${this.get('lastname')}`;
  }),

  email: DS.attr('string'),
  picture: DS.attr('string'),

  active: DS.attr('boolean'),

  articles: DS.hasMany('article', { async: true }),
  comments: DS.hasMany('comment', { async: true })
});
