import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import config from '../config/environment';

export default Ember.Route.extend(ApplicationRouteMixin, {
  session: Ember.inject.service(),
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),

  beforeModel() {
    this._super();

    if (this.get('session.isAuthenticated')) {
      return this.get('fetchUser').call(this);
    }
  },

  fetchUser() {
    // use session access_token to validate if we are still authenticated
    const access_token = this.get('session.data.authenticated.access_token');
    
    if (access_token) {
      return this.get('ajax').request(`${config.serverUrl || 'http://localhost:3000'}/auth/check?access_token=${access_token}`)
        .then(accessObj => {
          return this.get('store').queryRecord('user', { email: accessObj.email });
        }).then(userObj => {
          this.set('user.current', userObj);
        }).catch(() => {
          this.get('session').invalidate();
        });
    } else {
      // if no access_token, invalidate the session
      return this.get('session').invalidate();
    }
  },

  sessionAuthenticated() {
    this._super();
    this.get('fetchUser').call(this);
  }
});
