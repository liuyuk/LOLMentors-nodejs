/*
  Enable the node.js server to initialize.
  Source: "Node.js By Example"
*/

var http = require('http');
var session = require('cookie-session');
//var port =  3000;

var Assets = require('./backend/Assets');
var API = require('./backend/API');
var Default = require('./backend/Default');

var Router = require('./frontend/js/lib/Router')();

Router
.add('static', Assets)
.add('api', API)
.add(Default);

var checkSession = function(req, res) {
  session({
    keys: ['LOLMentors']
  })(req, res, function() {
    unofficial_process(req, res);
  });
}

var unofficial_process = function(req, res) {
  Router.check(req.url, [req, res]);
}

var port = Number(process.env.PORT || 3000);
var app = http.createServer(checkSession).listen(port);
console.log("Listening on port " + port);

