import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service(),
  user: Ember.inject.service(),

  actions: {
    authenticate() {
      this.get('session')
        .authenticate('authenticator:torii', 'google-oauth2');
        // .authenticate('authenticator:torii', 'google-oauth2-bearer');
        // .authenticate('authenticator:torii', 'facebook-connect');
    },

    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
