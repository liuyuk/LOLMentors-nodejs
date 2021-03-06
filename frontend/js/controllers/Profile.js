/*
  Controller module of the profile page.
  Updates the attributess of the user and
  displays a list of the user's mentors/mentees.
*/

var Mentors = require('../models/Mentors');

module.exports = Ractive.extend({
  template: require('../../tpl/profile'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  data: {
    mentors: []
  },
  onrender: function() {
    var self = this;
    var mentors = new Mentors();
      
    this.set(userModel.get('value'));
    this.on('updateProfile', function() {
      userModel.set('value.email', this.get('email'));
      userModel.set('value.ingameName', this.get('ingameName'));
      userModel.set('value.rank', this.get('rank'));
      userModel.set('value.position', this.get('position'));
      if(this.get('password') != '') {
        userModel.set('value.password', this.get('password'));
      }
      userModel.save(function(error, result) {
        if(error) {
          self.set('error', error.error);
        } else {
          self.set('error', false);
          self.set('success', 'Profile updated successfully.');
        }
      });
    });
    
    mentors.fetch(function(err, result) {
      self.set('mentors', result.mentors);
    });
  }
});