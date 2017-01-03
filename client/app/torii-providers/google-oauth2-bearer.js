import GoogleOauth2BearerProvider from 'torii/providers/google-oauth2-bearer';

export default GoogleOauth2BearerProvider.extend({
  fetch(data) {
    return data;
  }
});
