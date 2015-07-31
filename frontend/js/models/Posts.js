/*
  Model component for the post-request functionality.
*/

var ajax = require('../lib/Ajax');
var Base = require('./Base');

module.exports = Base.extend({
  data: {
    url:'/api/posts'
  },
  create: function(formData, cb) {
    var self = this;
    ajax.request({
      url: this.get('url'),
      method: 'POST',
      formData: formData,
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