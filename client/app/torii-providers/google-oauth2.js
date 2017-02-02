import GoogleOauth2Provider from 'torii/providers/google-oauth2';
import { configurable } from 'torii/configuration';

// extend GoogleOauth2Provider to be google's oauth2/v2
export default GoogleOauth2Provider.extend({
  baseUrl: 'https://accounts.google.com/o/oauth2/v2/auth',

  prompt: configurable('prompt', 'consent'),

  fetch(data) {
    return data;
  }
});
