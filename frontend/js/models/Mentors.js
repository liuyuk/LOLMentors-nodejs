var ajax = require('../lib/Ajax');
var Base = require('./Base');

module.exports = Base.extend({
  data: {
    url:'/api/mentors'
  },
  find: function(searchTarget, callback){
    ajax.request({
      url: this.get('url') + '/find',
      method: 'POST',
      data: {
        searchTarget: searchTarget
      },
      json: true
    })
    .done(function(result) {
      callback(null, result);
    })
    .fail(function(xhr) {
      callback(JSON.parse(xhr.responseText));
    });
  }
});