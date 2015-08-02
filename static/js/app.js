(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
  Controller module of the Find Mentors Page
  handles "find" and "add" requests sent
  from the view module.
*/

var Mentors = require('../models/Mentors');

module.exports = Ractive.extend({
  template: require('../../tpl/find-mentors'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  data: {
    message: '',
    searchTarget: '',
    foundMentors: null
  },
  onrender: function() {
    var model = new Mentors();
    var self = this;
      
    this.on('find', function(e) {
      self.set('message', '');
      var searchTarget = this.get('inputCri');
      model.find(searchTarget, function(err, res) {
        if (res.mentors && res.mentors.length > 0){
          self.set('foundMentors', res.mentors);
        } else {
          self.set('foundMentors', null);
            self.set('message', 'Sorry, none of the users satisfy that criteria.');
        }
      });
    });
      
    this.on('add', function(e, id) {
      model.add(id, function(err, res) {
        self.set('foundMentors', null);
        if(err) {
          self.set('message', 'Sorry, cannot add that mentor.')
        } else if (res.success === 'OK') {
          self.set('message', 'Successfully added that mentor!');
        }
      });
    });
  }
});
},{"../../tpl/find-mentors":18,"../models/Mentors":12,"../views/Footer":16,"../views/Navigation":17}],2:[function(require,module,exports){
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
},{"../../tpl/home":20,"../views/Footer":16,"../views/Navigation":17}],3:[function(require,module,exports){
module.exports = Ractive.extend({
  template: require('../../tpl/loaderio-44c97e4fd363c827b5b03756540133a2'),
  onrender: function() {}
});
},{"../../tpl/loaderio-44c97e4fd363c827b5b03756540133a2":21}],4:[function(require,module,exports){
/*
  Controller module of the login page.
  Receives userName and password values
  from the view component, and sends them
  to the model component.
*/

module.exports = Ractive.extend({
  template: require('../../tpl/login'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  onrender: function() {
    var self = this;
    this.observe('userName', userModel.setter('userName'));
    this.observe('password', userModel.setter('password'));
    this.on('login', function() {
      userModel.login(function(error, result) {
        if(error) {
          self.set('error', error.error);
        } else {
          self.set('error', false);
          window.location.href = '/';
        }
      });
    });
  }
});
},{"../../tpl/login":22,"../views/Footer":16,"../views/Navigation":17}],5:[function(require,module,exports){
/*
  Controller module for the post-request function.
  Handles the getting and setting a user post(request).
*/

var PostModel = require('../models/Posts');

module.exports = Ractive.extend({
  template: require('../../tpl/posts'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  data: { },
  onrender: function() {
    var model = new PostModel();
    var self = this;
      
    var postId = this.get('postId');
    if(postId) {
      model.getPost(postId, function(err, result) {
        if (!err && result.posts.length > 0) {
          var post = result.posts[0];
          self.set('postTitle', post.title);
          self.set('postDetails', post.details);
          self.set('postType', post.type);
          self.set('postUser', post.userName);
        } else {
          self.set('postTitle', 'Missing.');
        }
      });
      return;
    }
      
    this.on('create', function() {
      var formData = new FormData();
      formData.append("title", this.get('title'));
      formData.append("details", this.get('details'));
      formData.append("type", this.get('type'));
      model.create(formData, function(error, result) {
        if(error) {
          self.set('error', error.error);
        } else {
          self.set('title', '');
          self.set('details', '');
          self.set('type', '');
          self.set('error', false);
          self.set('success', 'Sucessfully added the post.');
        }
      });
    });
      
    model.fetch(function(error, result) {
      self.set('posts', result.posts);
    });
  }
});
},{"../../tpl/posts":24,"../models/Posts":13,"../views/Footer":16,"../views/Navigation":17}],6:[function(require,module,exports){
/*
  Controller module of the profile page.
  Updates the attributess of the user and
  displays a list of the user's mentors/mentees.
*/

var Mentors = require('../models/Mentors');

module.exports = Ractive.extend({
  template: require('../../tpl/profile'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  data: {
    mentors: []
  },
  onrender: function() {
    var self = this;
    var mentors = new Mentors();
      
    this.set(userModel.get('value'));
    this.on('updateProfile', function() {
      userModel.set('value.email', this.get('email'));
      userModel.set('value.ingameName', this.get('ingameName'));
      userModel.set('value.rank', this.get('rank'));
      userModel.set('value.position', this.get('position'));
      if(this.get('password') != '') {
        userModel.set('value.password', this.get('password'));
      }
      userModel.save(function(error, result) {
        if(error) {
          self.set('error', error.error);
        } else {
          self.set('error', false);
          self.set('success', 'Profile updated successfully.');
        }
      });
    });
    
    mentors.fetch(function(err, result) {
      self.set('mentors', result.mentors);
    });
  }
});
},{"../../tpl/profile":25,"../models/Mentors":12,"../views/Footer":16,"../views/Navigation":17}],7:[function(require,module,exports){
/*
  Controller module of the register page.
  Receives values from the register view,
  and sets the user's model component.
*/

module.exports = Ractive.extend({
  template: require('../../tpl/register'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  onrender: function() {
    var self = this;
    this.observe('ingameName', userModel.setter('value.ingameName'));
    this.observe('rank', userModel.setter('value.rank'));
    this.observe('position', userModel.setter('value.position'));
    this.observe('userName', userModel.setter('value.userName'));
    this.observe('email', userModel.setter('value.email'));
    this.observe('password', userModel.setter('value.password'));
    this.on('register', function() {
      userModel.create(function(error, result) {
        if(error) {
          self.set('error', error.error);
        } else {
          self.set('error', false);
          self.set('success', 'Registration successful. Login <a href="/login">Now</a> !');
        }
      });
    });
  }
});
},{"../../tpl/register":26,"../views/Footer":16,"../views/Navigation":17}],8:[function(require,module,exports){
/*
  Generated by Gulp.
  Handles the routing of the pages.
*/

var Router = require('./lib/Router')();
var Home = require('./controllers/Home');
var Loader = require('./controllers/Loader');
var Register = require('./controllers/Register');
var Login = require('./controllers/Login');
var Profile = require('./controllers/Profile');
var FindMentors = require('./controllers/FindMentors');
var Posts = require('./controllers/Posts');
var UserModel = require('./models/User');
var currentPage;
var body;

var showPage = function(newPage) {
  if(currentPage) currentPage.teardown();
  currentPage = newPage;
  body.innerHTML = '';
  currentPage.render(body);
  currentPage.on('navigation.goto', function(e, route) {
    Router.navigate(route);
  });
}

window.onload = function() {

  body = document.querySelector('body .container');
  userModel = new UserModel();
  userModel.fetch(function(error, result) {
    Router
    .add('home', function() {
      var p = new Home();
      showPage(p);
    })
    .add('loader', function() {
      var p = new Loader();
      showPage(p);
    })
    .add('register', function() {
      var p = new Register();
      showPage(p);
    })
    .add('login', function() {
      var p = new Login();
      showPage(p);
    })
    .add('logout', function() {
      userModel.logout(function(error, result) {
        window.location.href = '/';
      });
    })
    .add('profile', function() {
      if(userModel.isLogged()) {
        var p = new Profile();
        showPage(p);
      } else {
        Router.navigate('login');
      }      
    })
    .add('find-mentors', function() {
      if(userModel.isLogged()) {
        var p = new FindMentors();
        showPage(p);
      } else {
        Router.navigate('login');
      }
    })
    .add('posts/:id', function(param) {
      if(userModel.isLogged()) {
        var p = new Posts({
          data: {
            postId: param.id
          }
        });
        showPage(p);
      } else {
        Router.navigate('login');
      }
    })
    .add('posts', function() {
      if(userModel.isLogged()) {
        var p = new Posts();
        showPage(p);
      } else {
        Router.navigate('login');
      }
    })
    .add(function() {
      Router.navigate('home');
    })
    .listen()
    .check();
  });

}
},{"./controllers/FindMentors":1,"./controllers/Home":2,"./controllers/Loader":3,"./controllers/Login":4,"./controllers/Posts":5,"./controllers/Profile":6,"./controllers/Register":7,"./lib/Router":10,"./models/User":14}],9:[function(require,module,exports){
/*
  Ajax library used for asynchronous client/server interations.
  Detailed explanations in the documentations.
  Source: "Node.js By Example"
*/

module.exports = {
  request: function(ops) {
    if(typeof ops == 'string') ops = { url: ops };
    ops.url = ops.url || '';
    ops.method = ops.method || 'get'
    ops.data = ops.data || {};
    var getParams = function(data, url) {
      var arr = [], str;
      for(var name in data) {
        arr.push(name + '=' + encodeURIComponent(data[name]));
      }
      str = arr.join('&');
      if(str != '') {
        return url ? (url.indexOf('?') < 0 ? '?' + str : '&' + str) : str;
      }
      return '';
    }
    var api = {
      host: {},
      process: function(ops) {
        var self = this;
        this.xhr = null;
        if(window.ActiveXObject) { this.xhr = new ActiveXObject('Microsoft.XMLHTTP'); }
        else if(window.XMLHttpRequest) { this.xhr = new XMLHttpRequest(); }
        if(this.xhr) {
          this.xhr.onreadystatechange = function() {
            if(self.xhr.readyState == 4 && self.xhr.status == 200) {
              var result = self.xhr.responseText;
              if(ops.json === true && typeof JSON != 'undefined') {
                result = JSON.parse(result);
              }
              self.doneCallback && self.doneCallback.apply(self.host, [result, self.xhr]);
            } else if(self.xhr.readyState == 4) {
              self.failCallback && self.failCallback.apply(self.host, [self.xhr]);
            }
            self.alwaysCallback && self.alwaysCallback.apply(self.host, [self.xhr]);
          }
        }
        if(ops.method == 'get') {
          this.xhr.open("GET", ops.url + getParams(ops.data, ops.url), true);
        } else {
          if (ops.formData) {
            this.xhr.open(ops.method, ops.url);
          } else {
            this.xhr.open(ops.method, ops.url, true);
            this.setHeaders({
              'X-Requested-With': 'XMLHttpRequest',
              'Content-type': 'application/x-www-form-urlencoded'
            });
          }
        }
        if(ops.headers && typeof ops.headers == 'object') {
          this.setHeaders(ops.headers);
        }       
        setTimeout(function() {
          if (ops.formData) {
            self.xhr.send(ops.formData);
          } else {
          ops.method == 'get' ? self.xhr.send() : self.xhr.send(getParams(ops.data)); 
          }
        }, 20);
        return this;
      },
      done: function(callback) {
        this.doneCallback = callback;
        return this;
      },
      fail: function(callback) {
        this.failCallback = callback;
        return this;
      },
      always: function(callback) {
        this.alwaysCallback = callback;
        return this;
      },
      setHeaders: function(headers) {
        for(var name in headers) {
          this.xhr && this.xhr.setRequestHeader(name, headers[name]);
        }
      }
    }
    return api.process(ops);
  }
}
},{}],10:[function(require,module,exports){
/*
  Router component used for front-end back-end communication.
  Detailed explaination in the decumentation.
  Source: "Node.js By Example"
*/

module.exports = function() {
  return {
    routes: [],
    root: '/',
    getFragment: function() {
      var fragment = '';
      fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
      fragment = fragment.replace(/\?(.*)$/, '');
      fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
      return this.clearSlashes(fragment);
    },
    clearSlashes: function(path) {
      return path.toString().replace(/\/$/, '').replace(/^\//, '');
    },
    add: function(re, handler) {
      if(typeof re == 'function') {
        handler = re;
        re = '';
      }
      this.routes.push({ re: re, handler: handler});
      return this;
    },
    check: function(f, params) {
      var fragment = typeof f !== 'undefined' ? f.replace(/^\//, '') : this.getFragment(), vars;
      for(var i=0; i<this.routes.length; i++) {
        var match, re = this.routes[i].re;
        re = re.replace(/^\//, '');
        var vars = re.match(/:[^\s/]+/g);
        var r = new RegExp('^' + re.replace(/:[^\s/]+/g, '([\\w-]+)'));
        match = fragment.match(r);
        if(match) {
          match.shift();
          var matchObj = {};
          if(vars) {
            for(var j=0; j<vars.length; j++) {
              var v = vars[j];
              matchObj[v.substr(1, v.length)] = match[j];
            }
          }
          this.routes[i].handler.apply({}, (params || []).concat([matchObj]));
          return this;
        }
      }
      return false;
    },
    listen: function() {
      var self = this;
      var current = self.getFragment();
      var fn = function() {
        if(current !== self.getFragment()) {
          current = self.getFragment();
          self.check(current);
        }
      }
      clearInterval(this.interval);
      this.interval = setInterval(fn, 50);
      return this;
    },
    navigate: function(path) {
      path = path ? path : '';
      history.pushState(null, null, this.root + this.clearSlashes(path));
      return this;
    }
  }
};
},{}],11:[function(require,module,exports){
/*
  Common functions used by other models.
  Detailed explanations in the documentations.
  Source: "Node.js By Example"
*/

var ajax = require('../lib/Ajax');
module.exports = Ractive.extend({
  data: {
    value: null,
    url: ''
  },
  fetch: function(cb) {
    var self = this;
    ajax.request({
      url: self.get('url'),
      json: true
    })
    .done(function(result) {
      self.set('value', result);
      if(cb) {
        cb(null, result);
      }
    })
    .fail(function(xhr) {
      self.set('value', null);
      if(cb) {
        cb({ error: 'Error loading ' + self.get('url')});
      }
    });
    return this;
  },
  create: function(cb) {
    var self = this;
    ajax.request({
      url: self.get('url'),
      method: 'POST',
      data: this.get('value'),
      json: true
    })
    .done(function(result) {
      if(cb) {
        cb(null, result);
      }
    })
    .fail(function(xhr) {
      if(cb) {
        cb(JSON.parse(xhr.responseText));
      }
    });
    return this;
  },
  save: function(cb) {
    var self = this;
    ajax.request({
      url: self.get('url'),
      method: 'PUT',
      data: this.get('value'),
      json: true
    })
    .done(function(result) {
      if(cb) {
        cb(null, result);
      }
    })
    .fail(function(xhr) {
      if(cb) {
        cb(JSON.parse(xhr.responseText));
      }
    });
    return this;
  },
  bindComponent: function(component) {
    if(component) {
      this.observe('value', function(v) {
        for(var key in v) component.set(key, v[key]);
      }, { init: false });
    }
    return this;
  },
  setter: function(key) {
    var self = this;
    return function(v) {
      self.set(key, v);
    }
  }
});
},{"../lib/Ajax":9}],12:[function(require,module,exports){
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
},{"../lib/Ajax":9,"./Base":11}],13:[function(require,module,exports){
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
  },
  getPost: function(postId, cb) {
    var self = this;
    ajax.request({
      url: this.get('url') + '/' + postId,
      method: 'GET',
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
},{"../lib/Ajax":9,"./Base":11}],14:[function(require,module,exports){
/*
  Model component for login/logout functionalities.
*/

var ajax = require('../lib/Ajax');
var Base = require('./Base');
module.exports = Base.extend({
  data: {
    url: '/api/user'
  },
  login: function(cb) {
    ajax.request({
      url: this.get('url') + '/login',
      method: 'POST',
      data: {
        userName: this.get('userName'),
        password: this.get('password')
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
  logout: function(cb) {
    ajax.request({
      url: this.get('url') + '/logout',
      json: true
    })
    .done(function(result) {
      cb(null, result);
    })
    .fail(function(xhr) {
      cb(JSON.parse(xhr.responseText));
    });
  },
  isLogged: function() {
    return this.get('value.userName');
  }
});
},{"../lib/Ajax":9,"./Base":11}],15:[function(require,module,exports){
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
},{"./Base":11}],16:[function(require,module,exports){
/*
  View component of the footer.
  Source: "Node.js By Example"
*/

var FooterModel = require('../models/Version');

module.exports = Ractive.extend({
  template: require('../../tpl/footer'),
  onrender: function() {
    var model = new FooterModel();
    model.bindComponent(this).fetch();
  }
});
},{"../../tpl/footer":19,"../models/Version":15}],17:[function(require,module,exports){
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
},{"../../tpl/navigation":23}],18:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-md-12"},"f":[{"t":7,"e":"h1","f":[{"t":7,"e":"img","a":{"src":"http://oi62.tinypic.com/24npvgi.jpg","class":"img-responsive"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"page-header"},"f":[{"t":7,"e":"h1","f":["Find Mentors"]}]}," ",{"t":7,"e":"form","a":{"class":"form-horizontal","onsubmit":"return false;"},"f":[{"t":4,"n":50,"r":"loading","f":[{"t":7,"e":"p","f":["Loading. Please wait."]}]},{"t":4,"n":51,"f":[{"t":7,"e":"h4","f":["Please provide some information about your mentor/mentee"]}," ",{"t":7,"e":"p","f":["e.g. Username, Favourite Position, Ladder Rank"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"inputCri","value":[{"t":2,"r":"inputCri"}]}}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"input","a":{"type":"button","class":"btn btn-primary","value":"Find"},"v":{"click":"find"}}," ",{"t":7,"e":"br"}],"r":"loading"}]}," ",{"t":4,"n":50,"x":{"r":["foundMentors"],"s":"_0!==null"},"f":[{"t":4,"n":52,"r":"foundMentors","f":[{"t":7,"e":"div","a":{"class":"bs-component"},"f":[{"t":7,"e":"div","a":{"class":"jumbotron"},"f":[{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-sm-2 col-md-2 col-lg-2 text-center"},"f":[{"t":7,"e":"h4","f":[{"t":2,"r":"userName"}]}]}," ",{"t":7,"e":"div","a":{"class":"col-sm-4 col-md-4 col-lg-4  col-centered"},"f":[{"t":4,"n":50,"x":{"r":["rank"],"s":"_0===\"Diamond\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"https://d11y3kg0vwf4zk.cloudfront.net/assets/league/diamond_1-fb06638b5b85ad838890236a526c3b94.png","class":"img-responsive center-block"}}]}]}," ",{"t":4,"n":50,"x":{"r":["rank"],"s":"_0===\"Platinum\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"http://lpuboosting.com/img/general/ranks/platinum.png","class":"img-responsive center-block"}}]}]}," ",{"t":4,"n":50,"x":{"r":["rank"],"s":"_0===\"Gold\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"https://d11y3kg0vwf4zk.cloudfront.net/assets/league/gold_1-fb62f7a2caa3c755b9f15f473d4af897.png","class":"img-responsive center-block"}}]}]}," ",{"t":4,"n":50,"x":{"r":["rank"],"s":"_0===\"Silver\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"https://d11y3kg0vwf4zk.cloudfront.net/assets/league/silver_1-43dd69b33ae36e78ff2cc0cabdd5730c.png","class":"img-responsive center-block"}}]}]}," ",{"t":4,"n":50,"x":{"r":["rank"],"s":"_0===\"Bronze\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"http://img2.wikia.nocookie.net/__cb20130928162132/leagueoflegends/images/b/b4/BronzeBadgeSeason2.png","class":"img-responsive center-block"}}]}]}," ",{"t":4,"n":50,"x":{"r":["rank"],"s":"_0===\"Master\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"http://www.newsoflegends.com/wp-content/uploads/2014/08/image-80.png","class":"img-responsive center-block"}}]}]}," ",{"t":4,"n":50,"x":{"r":["rank"],"s":"_0===\"Challenger\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"http://rankedboost.com/file/2014/09/challenger-rewards-lol.png","class":"img-responsive center-block"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"col-sm-4 col-lg-4 col-md-4  col-centered"},"f":[{"t":4,"n":50,"x":{"r":["position"],"s":"_0===\"Top\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"http://img4.wikia.nocookie.net/__cb20140607013217/leagueoflegends/images/thumb/2/2a/Tank_icon.jpg/110px-Tank_icon.jpg","class":"img-responsive positionpic"}}]}]}," ",{"t":4,"n":50,"x":{"r":["position"],"s":"_0===\"Jungle\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"http://img1.wikia.nocookie.net/__cb20140607013311/leagueoflegends/images/thumb/1/10/Fighter_icon.jpg/110px-Fighter_icon.jpg","class":"img-responsive positionpic"}}]}]}," ",{"t":4,"n":50,"x":{"r":["position"],"s":"_0===\"Mid\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"http://img2.wikia.nocookie.net/__cb20140607013101/leagueoflegends/images/thumb/2/2b/Mage_icon.jpg/110px-Mage_icon.jpg","class":"img-responsive positionpic"}}]}]}," ",{"t":4,"n":50,"x":{"r":["position"],"s":"_0===\"ADC\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"http://img1.wikia.nocookie.net/__cb20140607013149/leagueoflegends/images/thumb/0/06/Marksman_icon.jpg/110px-Marksman_icon.jpg","class":"img-responsive positionpic"}}]}]}," ",{"t":4,"n":50,"x":{"r":["position"],"s":"_0===\"Support\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"http://img1.wikia.nocookie.net/__cb20140607013321/leagueoflegends/images/thumb/3/34/Support_icon.jpg/110px-Support_icon.jpg","class":"img-responsive positionpic"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"col-sm-2 col-md-2 col-lg-2  text-center"},"f":[{"t":7,"e":"input","a":{"type":"button","class":"btn btn-primary btn-sm","value":"Add as Mentor"},"v":{"click":{"n":"add","d":[{"t":2,"r":"id"}]}}}]}]}]}]}]}]},{"t":4,"n":50,"x":{"r":["message"],"s":"_0!==\"\""},"f":[{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"alert alert-dismissible alert-success"},"f":[{"t":7,"e":"p","f":[{"t":3,"r":"message"}]}]}]},{"t":7,"e":"appfooter"}]}
},{}],19:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"footer","f":["Version: ",{"t":2,"r":"version"}]}]}
},{}],20:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-md-12"},"f":[{"t":7,"e":"h1","f":[{"t":7,"e":"img","a":{"src":"http://oi60.tinypic.com/evctbk.jpg","class":"img-responsive"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"page-header"},"f":[{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-lg-8 col-md-7 col-sm-6"},"f":[{"t":7,"e":"h1","f":["Welcome to LOLMentors"]}," ",{"t":7,"e":"p","a":{"class":"lead"},"f":["A website designed to help fellow summoners improve"]}]}]}]}," ",{"t":7,"e":"appfooter"}]}
},{}],21:[function(require,module,exports){
module.exports = {"v":1,"t":["loaderio-44c97e4fd363c827b5b03756540133a2"]}
},{}],22:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-md-12"},"f":[{"t":7,"e":"h1","f":[{"t":7,"e":"img","a":{"src":"http://oi57.tinypic.com/eimfs3.jpg","class":"img-responsive"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"page-header"},"f":[{"t":7,"e":"h1","f":["Login"]}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-lg-12"},"f":[{"t":7,"e":"div","a":{"class":"well bs-component"},"f":[{"t":7,"e":"form","a":{"class":"form-horizontal"},"f":[{"t":7,"e":"fieldset","f":[{"t":4,"n":50,"x":{"r":["error"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"alert alert-dismissible alert-danger"},"f":[{"t":2,"r":"error"}]}]}," ",{"t":4,"n":50,"x":{"r":["success"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"alert alert-dismissible alert-success"},"f":[{"t":3,"r":"success"}]}]},{"t":4,"n":51,"f":[{"t":7,"e":"legend","f":["Please Enter Your Information"]}," ",{"t":7,"e":"label","a":{"for":"userName","class":"control-label"},"f":["Username"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"userName","value":[{"t":2,"r":"userName"}]}}," ",{"t":7,"e":"label","a":{"for":"password","class":"control-label"},"f":["Password"]}," ",{"t":7,"e":"input","a":{"type":"password","class":"form-control","id":"password","value":[{"t":2,"r":"password"}]}}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"input","a":{"type":"button","class":"btn btn-primary","value":"Login"},"v":{"click":"login"}}],"x":{"r":["success"],"s":"_0&&_0!=\"\""}}]}]}]}]}]}," ",{"t":7,"e":"appfooter"}]}
},{}],23:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"div","a":{"class":"navbar navbar-default navbar-fixed-top"},"f":[{"t":7,"e":"div","a":{"class":"container"},"f":[{"t":7,"e":"div","a":{"class":"navbar-header"},"f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"home"}},"a":{"class":"navbar-brand"},"f":["LOLMentors"]}]}," ",{"t":7,"e":"div","a":{"class":"navbar-collapse collapse"},"f":[{"t":7,"e":"ul","a":{"class":"nav navbar-nav"},"f":[{"t":4,"n":50,"x":{"r":["isLogged"],"s":"!_0"},"f":[{"t":7,"e":"li","f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"register"}},"f":["Register"]}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"login"}},"f":["Login"]}]}]},{"t":4,"n":51,"f":[{"t":7,"e":"li","f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"profile"}},"f":["Profile"]}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"find-mentors"}},"f":["Find Mentors"]}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"posts"}},"f":["Post Request"]}]}," ",{"t":7,"e":"li","a":{"class":"right"},"f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"logout"}},"f":["Logout"]}]}],"x":{"r":["isLogged"],"s":"!_0"}}]}]}]}]}]}
},{}],24:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-md-12"},"f":[{"t":7,"e":"h1","f":[{"t":7,"e":"img","a":{"src":"http://oi62.tinypic.com/24npvgi.jpg","class":"img-responsive"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"page-header"},"f":[{"t":7,"e":"h1","f":["Post a Request"]}]}," ",{"t":4,"n":50,"r":"postId","f":[{"t":7,"e":"div","f":[{"t":7,"e":"div","a":{"class":"bs-component"},"f":[{"t":7,"e":"div","a":{"class":"jumbotron"},"f":[{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-sm-4 col-md-4 col-lg-4"},"f":[{"t":7,"e":"h4","f":[{"t":2,"r":"postTitle"}]}]}," ",{"t":7,"e":"div","a":{"class":"col-sm-4 col-md-4 col-lg-4 col-lg-offset-8 col-md-offset-8"},"f":[{"t":7,"e":"h5","f":["Searching For: ",{"t":2,"r":"postType"}]}]}," ",{"t":7,"e":"div","a":{"class":"col-sm-4 col-md-4 col-lg-4 col-lg-offset-8 col-md-offset-8"},"f":[{"t":7,"e":"p","f":["By: ",{"t":2,"r":"postUser"}]}]}]}," ",{"t":7,"e":"p","f":[{"t":7,"e":"small","f":[{"t":2,"r":"postDetails"}]}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"bs-component"},"f":[{"t":7,"e":"div","a":{"class":"jumbotron"},"f":[{"t":7,"e":"form","a":{"class":"form-horizontal","enctype":"multipart/form-data","method":"post"},"f":[{"t":7,"e":"legend","f":["New Comment"]}," ",{"t":4,"n":50,"x":{"r":["error"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"alert alert-dismissible alert-danger"},"f":[{"t":2,"r":"error"}]}]}," ",{"t":4,"n":50,"x":{"r":["success"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"alert alert-dismissible alert-success"},"f":[{"t":3,"r":"success"}]}]}," ",{"t":7,"e":"textarea","a":{"class":"form-control","rows":"3","value":[{"t":2,"r":"commentDetails"}]}}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"input","a":{"type":"button","class":"btn btn-primary","value":"Post"},"v":{"click":"createComment"}}]}]}]}," ",{"t":7,"e":"hr"}]},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"bs-component"},"f":[{"t":7,"e":"div","a":{"class":"jumbotron"},"f":[{"t":7,"e":"form","a":{"class":"form-horizontal","enctype":"multipart/form-data","method":"post"},"f":[{"t":7,"e":"legend","f":["New Request"]}," ",{"t":4,"n":50,"x":{"r":["error"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"alert alert-dismissible alert-danger"},"f":[{"t":2,"r":"error"}]}]}," ",{"t":4,"n":50,"x":{"r":["success"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"alert alert-dismissible alert-success"},"f":[{"t":3,"r":"success"}]}]}," ",{"t":7,"e":"label","a":{"class":"control-label"},"f":["Title"]}," ",{"t":7,"e":"textarea","a":{"class":"form-control","rows":"1","value":[{"t":2,"r":"title"}]}}," ",{"t":7,"e":"label","a":{"class":"control-label"},"f":["Searching for: Mentor, Mentee, Others"]}," ",{"t":7,"e":"textarea","a":{"class":"form-control","rows":"1","value":[{"t":2,"r":"type"}]}}," ",{"t":7,"e":"label","a":{"class":"control-label"},"f":["Details"]}," ",{"t":7,"e":"textarea","a":{"class":"form-control","rows":"3","value":[{"t":2,"r":"details"}]}}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"input","a":{"type":"button","class":"btn btn-primary","value":"Post"},"v":{"click":"create"}}]}]}]}," ",{"t":7,"e":"h3","f":["Current Requests"]}," ",{"t":7,"e":"div","f":[{"t":4,"n":52,"r":"posts","i":"index","f":[{"t":7,"e":"div","f":[{"t":7,"e":"div","a":{"class":"bs-component"},"f":[{"t":7,"e":"div","a":{"class":"jumbotron"},"f":[{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-sm-4 col-md-4 col-lg-4"},"f":[{"t":7,"e":"h4","f":[{"t":2,"rx":{"r":"posts","m":[{"t":30,"n":"index"},"title"]}}]}]}," ",{"t":7,"e":"div","a":{"class":"col-sm-4 col-md-4 col-lg-4 col-lg-offset-8 col-md-offset-8"},"f":[{"t":7,"e":"h5","f":["Searching For: ",{"t":2,"rx":{"r":"posts","m":[{"t":30,"n":"index"},"type"]}}]}]}," ",{"t":7,"e":"div","a":{"class":"col-sm-4 col-md-4 col-lg-4 col-lg-offset-8 col-md-offset-8"},"f":[{"t":7,"e":"p","f":["By: ",{"t":2,"rx":{"r":"posts","m":[{"t":30,"n":"index"},"userName"]}}]}]}]}," ",{"t":7,"e":"p","f":[{"t":7,"e":"small","f":[{"t":2,"rx":{"r":"posts","m":[{"t":30,"n":"index"},"details"]}}]}]}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":["/posts/",{"t":2,"rx":{"r":"posts","m":[{"t":30,"n":"index"},"id"]}}],"class":"btn btn-primary btn-sm"},"f":["View this request"]}]}]}]}]}]}]}],"r":"postId"}]}
},{}],25:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-md-12"},"f":[{"t":7,"e":"h1","f":[{"t":7,"e":"img","a":{"src":"http://oi59.tinypic.com/2m5h2dx.jpg","class":"img-responsive"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"page-header"},"f":[{"t":7,"e":"h1","f":[{"t":3,"r":"userName"},"'s Profile"]}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-lg-4 col-md-4"},"f":[{"t":7,"e":"div","a":{"class":"well bs-component"},"f":[{"t":4,"n":50,"x":{"r":["rank"],"s":"_0===\"Diamond\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"https://d11y3kg0vwf4zk.cloudfront.net/assets/league/diamond_1-fb06638b5b85ad838890236a526c3b94.png","class":"img-responsive profile-center-block"}}]}]}," ",{"t":4,"n":50,"x":{"r":["rank"],"s":"_0===\"Platinum\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"http://lpuboosting.com/img/general/ranks/platinum.png","class":"img-responsive profile-center-block"}}]}]}," ",{"t":4,"n":50,"x":{"r":["rank"],"s":"_0===\"Gold\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"https://d11y3kg0vwf4zk.cloudfront.net/assets/league/gold_1-fb62f7a2caa3c755b9f15f473d4af897.png","class":"img-responsive profile-center-block"}}]}]}," ",{"t":4,"n":50,"x":{"r":["rank"],"s":"_0===\"Silver\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"https://d11y3kg0vwf4zk.cloudfront.net/assets/league/silver_1-43dd69b33ae36e78ff2cc0cabdd5730c.png","class":"img-responsive profile-center-block"}}]}]}," ",{"t":4,"n":50,"x":{"r":["rank"],"s":"_0===\"Bronze\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"http://img2.wikia.nocookie.net/__cb20130928162132/leagueoflegends/images/b/b4/BronzeBadgeSeason2.png","class":"img-responsive profile-center-block"}}]}]}," ",{"t":4,"n":50,"x":{"r":["rank"],"s":"_0===\"Master\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"http://www.newsoflegends.com/wp-content/uploads/2014/08/image-80.png","class":"img-responsive profile-center-block"}}]}]}," ",{"t":4,"n":50,"x":{"r":["rank"],"s":"_0===\"Challenger\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"http://rankedboost.com/file/2014/09/challenger-rewards-lol.png","class":"img-responsive profile-center-block"}}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"col-lg-4 col-md-4 col-centered"},"f":[{"t":7,"e":"div","a":{"class":"well bs-component"},"f":[{"t":4,"n":50,"x":{"r":["position"],"s":"_0===\"Top\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"http://img4.wikia.nocookie.net/__cb20140607013217/leagueoflegends/images/thumb/2/2a/Tank_icon.jpg/110px-Tank_icon.jpg","class":"img-responsive profile-positionpic"}}]}]}," ",{"t":4,"n":50,"x":{"r":["position"],"s":"_0===\"Jungle\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"http://img1.wikia.nocookie.net/__cb20140607013311/leagueoflegends/images/thumb/1/10/Fighter_icon.jpg/110px-Fighter_icon.jpg","class":"img-responsive profile-positionpic"}}]}]}," ",{"t":4,"n":50,"x":{"r":["position"],"s":"_0===\"Mid\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"http://img2.wikia.nocookie.net/__cb20140607013101/leagueoflegends/images/thumb/2/2b/Mage_icon.jpg/110px-Mage_icon.jpg","class":"img-responsive profile-positionpic"}}]}]}," ",{"t":4,"n":50,"x":{"r":["position"],"s":"_0===\"ADC\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"http://img1.wikia.nocookie.net/__cb20140607013149/leagueoflegends/images/thumb/0/06/Marksman_icon.jpg/110px-Marksman_icon.jpg","class":"img-responsive profile-positionpic"}}]}]}," ",{"t":4,"n":50,"x":{"r":["position"],"s":"_0===\"Support\""},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"http://img1.wikia.nocookie.net/__cb20140607013321/leagueoflegends/images/thumb/3/34/Support_icon.jpg/110px-Support_icon.jpg","class":"img-responsive profile-positionpic"}}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"col-lg-4 col-md-4"},"f":[{"t":7,"e":"div","a":{"class":"well bs-component"},"f":[{"t":7,"e":"h4","f":["Rating"]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-lg-12"},"f":[{"t":7,"e":"div","a":{"class":"well bs-component"},"f":[{"t":7,"e":"form","a":{"class":"form-horizontal"},"f":[{"t":7,"e":"fieldset","f":[{"t":4,"n":50,"x":{"r":["error"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"alert alert-dismissible alert-danger"},"f":[{"t":2,"r":"error"}]}]}," ",{"t":4,"n":50,"x":{"r":["success"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"alert alert-dismissible alert-success"},"f":[{"t":3,"r":"success"}]}]},{"t":4,"n":51,"f":[{"t":7,"e":"legend","f":["Edit Information"]}," ",{"t":7,"e":"label","a":{"for":"email","class":"control-label"},"f":["E-mail"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"email","value":[{"t":2,"r":"email"}]}}," ",{"t":7,"e":"label","a":{"for":"ingame-name","class":"control-label"},"f":["In-Game name"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"ingame-name","value":[{"t":2,"r":"ingameName"}]}}," ",{"t":7,"e":"label","a":{"for":"rank","class":"control-label"},"f":["Ladder Rank"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"rank","value":[{"t":2,"r":"rank"}]}}," ",{"t":7,"e":"label","a":{"for":"position","class":"control-label"},"f":["Favourite Position"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"position","value":[{"t":2,"r":"position"}]}}," ",{"t":7,"e":"label","a":{"for":"password","class":"control-label"},"f":["Change password"]}," ",{"t":7,"e":"input","a":{"type":"password","class":"form-control","id":"password","value":[{"t":2,"r":"password"}]}}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"input","a":{"type":"button","class":"btn btn-primary","value":"Update"},"v":{"click":"updateProfile"}}],"x":{"r":["success"],"s":"_0&&_0!=\"\""}}]}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"bs-docs-section"},"f":[{"t":7,"e":"div","a":{"class":"page-header"},"f":[{"t":7,"e":"h3","f":["Users In Mentorship"]}]}," ",{"t":7,"e":"div","f":[{"t":4,"n":50,"x":{"r":["mentors.length"],"s":"_0>0"},"f":[{"t":4,"n":52,"r":"mentors","i":"index","f":[{"t":7,"e":"div","a":{"class":"bs-component"},"f":[{"t":7,"e":"div","a":{"class":"jumbotron"},"f":[{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-sm-4 col-md-4 col-lg-4"},"f":[{"t":7,"e":"h4","f":[{"t":2,"rx":{"r":"mentors","m":[{"t":30,"n":"index"},"userName"]}}]}]}," ",{"t":7,"e":"div","a":{"class":"col-sm-4 col-md-4 col-lg-4"},"f":[{"t":7,"e":"h4","f":["IGN: ",{"t":2,"rx":{"r":"mentors","m":[{"t":30,"n":"index"},"ingameName"]}}]}]}," ",{"t":7,"e":"div","a":{"class":"col-sm-2 col-md-2 col-lg-2"},"f":[{"t":7,"e":"input","a":{"type":"button","class":"btn btn-primary btn-sm","value":"Rate"},"v":{"click":{"n":"rate","d":[{"t":2,"rx":{"r":"mentors","m":[{"t":30,"n":"index"},"userName"]}}]}}}]}]}]}]}]}]},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"alert alert-dismissible alert-success"},"f":[{"t":7,"e":"p","f":["You currently have no mentors or mentees."]}]}],"x":{"r":["mentors.length"],"s":"_0>0"}}]}]}," ",{"t":7,"e":"appfooter"}]}
},{}],26:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-md-12"},"f":[{"t":7,"e":"h1","f":[{"t":7,"e":"img","a":{"src":"http://oi57.tinypic.com/eimfs3.jpg","class":"img-responsive"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"page-header"},"f":[{"t":7,"e":"h1","f":["Register"]}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-lg-12"},"f":[{"t":7,"e":"div","a":{"class":"well bs-component"},"f":[{"t":7,"e":"form","a":{"class":"form-horizontal"},"f":[{"t":7,"e":"fieldset","f":[{"t":4,"n":50,"x":{"r":["error"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"alert alert-dismissible alert-danger"},"f":[{"t":2,"r":"error"}]}]}," ",{"t":4,"n":50,"x":{"r":["success"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"alert alert-dismissible alert-success"},"f":[{"t":3,"r":"success"}]}]},{"t":4,"n":51,"f":[{"t":7,"e":"legend","f":["Please Enter Your Information"]}," ",{"t":7,"e":"label","a":{"for":"userName","class":"control-label"},"f":["Username"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"userName","value":[{"t":2,"r":"userName"}]}}," ",{"t":7,"e":"label","a":{"for":"ingameName","class":"control-label"},"f":["In-game name"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"ingameName","value":[{"t":2,"r":"ingameName"}]}}," ",{"t":7,"e":"label","a":{"for":"rank","class":"control-label"},"f":["Ladder Rank (Bronze, Silver, Gold, Platinum, Diamond, Master, Challenger)"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"rank","value":[{"t":2,"r":"rank"}]}}," ",{"t":7,"e":"label","a":{"for":"position","class":"control-label"},"f":["Favourite Position (Top, Jungle, Mid, ADC, Support)"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"position","value":[{"t":2,"r":"position"}]}}," ",{"t":7,"e":"label","a":{"for":"email","class":"control-label"},"f":["Email"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"email","value":[{"t":2,"r":"email"}]}}," ",{"t":7,"e":"label","a":{"for":"password","class":"control-label"},"f":["Password"]}," ",{"t":7,"e":"input","a":{"type":"password","class":"form-control","id":"password","value":[{"t":2,"r":"password"}]}}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"input","a":{"type":"button","class":"btn btn-primary","value":"Register"},"v":{"click":"register"}}],"x":{"r":["success"],"s":"_0&&_0!=\"\""}}]}]}]}]}]}," ",{"t":7,"e":"appfooter"}]}
},{}]},{},[8])