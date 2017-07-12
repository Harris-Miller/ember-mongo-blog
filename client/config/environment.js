/* jshint node: true */

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'client',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    contentSecurityPolicy: {
      'connect-src': `'self' http://localhost:3000 ws://localhost:3000 ${process.env.SERVER_URL}`
    },

    torii: {
      // a 'session property will be injected on routes and controllers'
      providers: {
        'google-oauth2': {
          apiKey: '784728722932-loeasa79qg9v466f04u24am01gub4nea.apps.googleusercontent.com',
          redirectUri: process.env.REDIRECT_URI || 'http://localhost:4200/oauth2callback',
          scope: 'email profile'
        },
        'google-oauth2-bearer': {
          apiKey: '784728722932-loeasa79qg9v466f04u24am01gub4nea.apps.googleusercontent.com',
          redirectUri: process.env.REDIRECT_URI || 'http://localhost:4200/oauth2callback',
          scope: 'email profile'
        },
        'facebook-connect': {
          appId: '228509614265860',
          scope: 'email,public_profile'
        }
      }
    },

    serverUrl: process.env.SERVER_URL
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
