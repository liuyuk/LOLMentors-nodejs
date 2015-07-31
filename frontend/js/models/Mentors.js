/*
  Model component for the find-mentor functionality.
*/

var ajax = require('../lib/Ajax');
var Base = require('./Base');

module.exports = Base.extend({
  data: {
    url:'/api/mentors'
  },
  find: function(searchTarget, cb){
    ajax.request({
      url: this.get('url') + '/find',
      method: 'POST',
      data: {
        searchTarget: searchTarget
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
  add: function(id, cb) {
    ajax.request({
      url: this.get('url') + '/add',
      method: 'POST',
      data: {
        id: id
      },
      json: true
    })
    .done(function(result) {
      cb(null, result);
    })
    .fail(function(xhr) {
      cb(JSON.parse(xhr.responseText));
    });
  }
});