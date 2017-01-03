'use strict';

module.exports = {
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  redirect_uri: process.env.REDIRECT_URI,
  grant_type: 'authorization_code'
};
