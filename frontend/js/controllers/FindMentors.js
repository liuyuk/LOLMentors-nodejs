module.exports = Ractive.extend({
  template: require('../../tpl/find-mentors'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  data: {
    loading: false,
    message: '',
    searchTarget: '',
    foundMentors: null
  },
  onrender: function() {
      
  }
});