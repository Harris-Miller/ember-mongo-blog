import GoogleOauth2Provider from 'torii/providers/google-oauth2';
import { configurable } from 'torii/configuration';

// extend GoogleOauth2Provider to be google's oauth2/v2
export default GoogleOauth2Provider.extend({
  init() {
    // remove approval_promot, otherwise you get an conflict error with prompt
    const indexOf = this.get('optionalUrlParams').indexOf('approval_prompt');
    if (indexOf > -1) {
      this.get('optionalUrlParams').splice(indexOf, 1);
    }
  },

  baseUrl: 'https://accounts.google.com/o/oauth2/v2/auth',

  optionalUrlParams: ['prompt'],

  prompt: configurable('prompt', 'consent'),

  fetch(data) {
    return data;
  }
});
