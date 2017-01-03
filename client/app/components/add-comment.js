import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  user: Ember.inject.service(),

  actions: {
    addComment() {
      console.log('adding a comment');

      const commentText = this.get('commentText');
      console.log(commentText);

      if (!commentText) {
        return;
      }

      const newComment = this.get('store').createRecord('comment', {
        text: commentText,
        author: this.get('user.current'),
        article: this.get('article')
      });

      newComment.save()
        .then(() => {
          // clear commentText
          this.set('commentText', null);
        }).catch(() => {
          alert('could not save comment!');
        });
    }
  }
});
