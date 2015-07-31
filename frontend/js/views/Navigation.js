/*
  View component of the navigation bar.
  Source: "Node.js By Example"
*/

module.exports = Ractive.extend({
  template: require('../../tpl/navigation'),
  onconstruct: function() {
    this.data.isLogged = !!userModel.isLogged();
  }
});