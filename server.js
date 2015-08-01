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
    process(req, res);
  });
}

var process = function(req, res) {
  Router.check(req.url, [req, res]);
}

var app = http.createServer(checkSession).listen(8124, function() { //'listening' listener
  console.log('server bound');
});
//console.log("Listening on 127.0.0.1:" + port);

