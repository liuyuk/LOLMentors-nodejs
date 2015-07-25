var Mentors = require('../models/Mentors');

module.exports = Ractive.extend({
  template: require('../../tpl/find-mentors'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  data: {
    loading: false,
    message: '',
    searchTarget: '',
    foundMentors: null
  },
  onrender: function() {
    var model = new Mentors();
    var self = this;
      
    this.on('find', function(e) {
      self.set('loading', true);
      self.set('message', '');
      var searchTarget = this.get('rank');
      model.find(searchTarget, function(err, res) {
        if (res.mentors && res.mentors.length > 0){
          self.set('foundMentors', res.mentors);
        } else {
          self.set('foundMentors', null);
            self.set('message', 'Sorry, there are no users in that rank');
        }
        self.set('loading', false);
      });
    });
  }
});