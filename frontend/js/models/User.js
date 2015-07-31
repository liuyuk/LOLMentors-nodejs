/*
  Model component for login/logout functionalities.
*/

var ajax = require('../lib/Ajax');
var Base = require('./Base');
module.exports = Base.extend({
  data: {
    url: '/api/user'
  },
  login: function(cb) {
    ajax.request({
      url: this.get('url') + '/login',
      method: 'POST',
      data: {
        userName: this.get('userName'),
        password: this.get('password')
      },
      json: true
    })
    .done(function(result) {
      cb(null, result);
    })
    .fail(function(xhr) {
      cb(JSON.parse(xhr.responseText));
    });
  },
  logout: function(cb) {
    ajax.request({
      url: this.get('url') + '/logout',
      json: true
    })
    .done(function(result) {
      cb(null, result);
    })
    .fail(function(xhr) {
      cb(JSON.parse(xhr.responseText));
    });
  },
  isLogged: function() {
    return this.get('value.userName');
  }
});