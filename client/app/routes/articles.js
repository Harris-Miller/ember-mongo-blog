import Ember from 'ember';

export default Ember.Route.extend({
  model(/*params, transition*/) {
    return this.store.findAll('article');
  }
});
