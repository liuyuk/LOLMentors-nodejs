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
    this.on('create', function() {
      var formData = new FormData();
      formData.append("title", this.get('title'));
      formData.append("details", this.get('details'));
      model.create(formData, function(error, result) {
        if(error) {
          self.set('error', error.error);
        } else {
          self.set('title', '');
          self.set('details', '');
          self.set('error', false);
          self.set('success', 'Sucessfully added the post.');
        }
      });
    });
  }
});