module.exports = Ractive.extend({
  template: require('../../tpl/register'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  onrender: function() {
    var self = this;
    this.observe('ingameName', userModel.setter('value.ingameName'));
    this.observe('rank', userModel.setter('value.rank'));
    this.observe('position', userModel.setter('value.position'));
    this.observe('userName', userModel.setter('value.userName'));
    this.observe('email', userModel.setter('value.email'));
    this.observe('password', userModel.setter('value.password'));
    this.on('register', function() {
      userModel.create(function(error, result) {
        if(error) {
          self.set('error', error.error);
        } else {
          self.set('error', false);
          self.set('success', 'Registration successful. Login <a href="/login">Now</a> !');
        }
      });
    });
  }
});