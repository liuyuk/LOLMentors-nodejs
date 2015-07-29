module.exports = Ractive.extend({
  template: require('../../tpl/posts'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  data: {},
  onrender: function() {}
});