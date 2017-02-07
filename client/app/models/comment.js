import DS from 'ember-data';
import Base from './base';

export default Base.extend({
  text: DS.attr('string'),
  
  removed: DS.attr('boolean', { defaultValue: false }),
  
  author: DS.belongsTo('user', { async: true }),
  article: DS.belongsTo('article', { asyc: true })
});
