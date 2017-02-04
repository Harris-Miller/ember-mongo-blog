import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string'),
  
  removed: DS.attr('boolean', { defaultValue: false }),

  author: DS.belongsTo('user', { async: true }),
  comments: DS.hasMany('comment', { async: true }),

  created: DS.attr('date'),
  updated: DS.attr('date')
});
