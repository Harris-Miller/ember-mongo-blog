import Ember from 'ember';
import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';

export default ToriiAuthenticator.extend({
  torii: Ember.inject.service(),
  ajax: Ember.inject.service(),
  store: Ember.inject.service(),

  authenticate(provider, options) {
    return this._super(provider, options).then(data => {
      const authorizationCode = data.authorizationCode;
      delete data.authorizationCode;

      return this.get('ajax').post('http://localhost:3000/auth', { data: { authorizationCode } })
        .then(authObject => {
          // first, add the access_token onto the main data object
          data.access_token = authObject.access_token;
          // now that we have the auth object, we need to fetch the user object from the id_token
          return this.get('ajax').request(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${authObject.id_token}`);
        }).then(userObject => {
          // for first time log-ins, since we're authenticating using google
          // we need to create the user in our own database
          // now check if the user exists, by email
          console.log(userObject.email);
          return this.get('store').queryRecord('user', { email: userObject.email })
            .then(user => {
              console.log(user);
              if (!user) {
                console.log('no users, creating...');
                const newUser = this.get('store').createRecord('user', {
                  firstname: userObject.given_name,
                  lastname: userObject.family_name,
                  email: userObject.email,
                  picture: userObject.picture
                });

                // save and on return data on completion
                return newUser.save().then(() => data);
              }

              return data;
            });
        });
    });
  }
});
