import DS from 'ember-data';
import Base from './base';

export default Base.extend({
  title: DS.attr('string'),
  body: DS.attr('string'),
  
  removed: DS.attr('boolean', { defaultValue: false }),

  author: DS.belongsTo('user', { async: true }),
  comments: DS.hasMany('comment', { async: true })
});
