import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string'),
  
  removed: DS.attr('boolean', { defaultValue: false }),

  author: DS.belongsTo('user', { async: true }),
  comments: DS.hasMany('comment', { async: true }),

  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date')
});
