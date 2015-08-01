/*
  Controller module for the post-request function.
  Handles the getting and setting a user post(request).
*/

var PostModel = require('../models/Posts');

module.exports = Ractive.extend({
  template: require('../../tpl/posts'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  data: { },
  onrender: function() {
    var model = new PostModel();
    var self = this;
      
    var postId = this.get('postId');
    if(postId) {
      model.getPost(postId, function(err, result) {
        if (!err && result.posts.length > 0) {
          var post = result.posts[0];
          self.set('postTitle', post.title);
          self.set('postDetails', post.details);
          self.set('postType', post.type);
          self.set('postUser', post.userName);
        } else {
          self.set('postTitle', 'Missing.');
        }
      });
      return;
    }
      
    this.on('create', function() {
      var formData = new FormData();
      formData.append("title", this.get('title'));
      formData.append("details", this.get('details'));
      formData.append("type", this.get('type'));
      model.create(formData, function(error, result) {
        if(error) {
          self.set('error', error.error);
        } else {
          self.set('title', '');
          self.set('details', '');
          self.set('type', '');
          self.set('error', false);
          self.set('success', 'Sucessfully added the post.');
        }
      });
    });
      
    model.fetch(function(error, result) {
      self.set('posts', result.posts);
    });
  }
});