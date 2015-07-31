/*
  Model of the current version of the app.
  Source: "Node.js By Example"
*/

var Base = require('./Base');
module.exports = Base.extend({
  data: {
    url: '/api/version'
  }
});