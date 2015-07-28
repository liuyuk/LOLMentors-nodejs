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
      var searchTarget = this.get('inputCri');
      model.find(searchTarget, function(err, res) {
        if (res.mentors && res.mentors.length > 0){
          self.set('foundMentors', res.mentors);
        } else {
          self.set('foundMentors', null);
            self.set('message', 'Sorry, none of the users satisfy that criteria');
        }
        self.set('loading', false);
      });
    });
      
    this.on('add', function(e, id) {
      self.set('loading', true);
      model.add(id, function(err, res) {
        self.set('foundMentors', null);
        if(err) {
          self.set('message', 'Sorry, cannot add that mentor')
        } else if (res.success === 'OK') {
          self.set('message', 'Successfully added that mentor!');
        }
        self.set('loading', false);
      });
    });
  }
});