import Ember from 'ember';
import AuthenticatedRouteMixin from '../mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  user: Ember.inject.service(),

  actions: {
    saveArticle(article) {
      if (!article.title) {
        alert('article must have a title!');
        return;
      }

      if (!article.body) {
        alert('article must have a body!');
        return;
      }

      const newArticle = this.get('store').createRecord('article', {
        title: article.title,
        body: article.body,
        author: this.get('user.current')
      });

      newArticle.save()
        .then(() => {
          // transition to article view
          this.transitionTo('singleArticle', newArticle);
        }).catch(err => {
          console.log(err);
          alert('could not save article!');
        });
    }
  }
});
