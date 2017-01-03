import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from '../config/environment';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:oauth2-bearer',
  host: config.serverUrl || 'http://localhost:3000',
  namespace: 'api',
  coalesceFindRequests: true
});
