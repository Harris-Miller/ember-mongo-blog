import DS from 'ember-data';

export default DS.Model.extend({
  text: DS.attr('string'),
  
  author: DS.belongsTo('user', { async: true }),
  article: DS.belongsTo('article', { asyc: true }),

  created: DS.attr('date'),
  updated: DS.attr('date')
});
