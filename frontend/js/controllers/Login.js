/*
  Controller module of the login page.
  Receives userName and password values
  from the view component, and sends them
  to the model component.
*/

module.exports = Ractive.extend({
  template: require('../../tpl/login'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  onrender: function() {
    var self = this;
    this.observe('userName', userModel.setter('userName'));
    this.observe('password', userModel.setter('password'));
    this.on('login', function() {
      userModel.login(function(error, result) {
        if(error) {
          self.set('error', error.error);
        } else {
          self.set('error', false);
          window.location.href = '/';
        }
      });
    });
  }
});