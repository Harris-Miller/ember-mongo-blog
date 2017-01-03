import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('articles');
  this.route('create', { path: 'articles/create' });
  this.route('singleArticle', { path: 'articles/:article_id' }, function() {
    this.route('edit');
  });
  this.route('about');
  this.route('me');
});

export default Router;
