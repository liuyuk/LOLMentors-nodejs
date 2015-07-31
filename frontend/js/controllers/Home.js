/*
  Controller module of the home page.
  Source: "Node.js By Example"
*/

module.exports = Ractive.extend({
  template: require('../../tpl/home'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  onrender: function() {}
});