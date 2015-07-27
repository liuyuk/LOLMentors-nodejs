(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Mentors = require('../models/Mentors');

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
    var model = new Mentors();
    var self = this;
      
    this.on('find', function(e) {
      self.set('loading', true);
      self.set('message', '');
      var searchTarget = this.get('inputCri');
      model.find(searchTarget, function(err, res) {
        if (res.mentors && res.mentors.length > 0){
          self.set('foundMentors', res.mentors);
        } else {
          self.set('foundMentors', null);
            self.set('message', 'Sorry, none of the users satisfy that criteria');
        }
        self.set('loading', false);
      });
    });
  }
});
},{"../../tpl/find-mentors":15,"../models/Mentors":10,"../views/Footer":13,"../views/Navigation":14}],2:[function(require,module,exports){
module.exports = Ractive.extend({
  template: require('../../tpl/home'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  onrender: function() {
    
  }
});
},{"../../tpl/home":17,"../views/Footer":13,"../views/Navigation":14}],3:[function(require,module,exports){
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
},{"../../tpl/login":18,"../views/Footer":13,"../views/Navigation":14}],4:[function(require,module,exports){
module.exports = Ractive.extend({
  template: require('../../tpl/profile'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  onrender: function() {
    var self = this;
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
    this.on('deleteProfile', function() {
      if(confirm('Are you sure! Your account will be deleted permanently.')) {
        userModel.del(function() {
          window.location.href = '/';
        });
      }
    })
  }
});
},{"../../tpl/profile":20,"../views/Footer":13,"../views/Navigation":14}],5:[function(require,module,exports){
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
},{"../../tpl/register":21,"../views/Footer":13,"../views/Navigation":14}],6:[function(require,module,exports){
var Router = require('./lib/Router')();
var Home = require('./controllers/Home');
var Register = require('./controllers/Register');
var Login = require('./controllers/Login');
var Profile = require('./controllers/Profile');
var FindMentors = require('./controllers/FindMentors');
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
    .add(function() {
      Router.navigate('home');
    })
    .listen()
    .check();
  });

}
},{"./controllers/FindMentors":1,"./controllers/Home":2,"./controllers/Login":3,"./controllers/Profile":4,"./controllers/Register":5,"./lib/Router":8,"./models/User":11}],7:[function(require,module,exports){
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
          this.xhr.open(ops.method, ops.url, true);
          this.setHeaders({
            'X-Requested-With': 'XMLHttpRequest',
            'Content-type': 'application/x-www-form-urlencoded'
          });
        }
        if(ops.headers && typeof ops.headers == 'object') {
          this.setHeaders(ops.headers);
        }       
        setTimeout(function() { 
          ops.method == 'get' ? self.xhr.send() : self.xhr.send(getParams(ops.data)); 
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
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
  del: function(cb) {
    var self = this;
    ajax.request({
      url: self.get('url'),
      method: 'DELETE',
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
},{"../lib/Ajax":7}],10:[function(require,module,exports){
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
},{"../lib/Ajax":7,"./Base":9}],11:[function(require,module,exports){
var ajax = require('../lib/Ajax');
var Base = require('./Base');
module.exports = Base.extend({
  data: {
    url: '/api/user'
  },
  login: function(callback) {
    var self = this;
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
      callback(null, result);
    })
    .fail(function(xhr) {
      callback(JSON.parse(xhr.responseText));
    });
  },
  logout: function(callback) {
    var self = this;
    ajax.request({
      url: this.get('url') + '/logout',
      json: true
    })
    .done(function(result) {
      callback(null, result);
    })
    .fail(function(xhr) {
      callback(JSON.parse(xhr.responseText));
    });
  },
  isLogged: function() {
    return this.get('value.userName');
  }
});
},{"../lib/Ajax":7,"./Base":9}],12:[function(require,module,exports){
var Base = require('./Base');
module.exports = Base.extend({
  data: {
    url: '/api/version'
  }
});
},{"./Base":9}],13:[function(require,module,exports){
var FooterModel = require('../models/Version');

module.exports = Ractive.extend({
  template: require('../../tpl/footer'),
  onrender: function() {
    var model = new FooterModel();
    model.bindComponent(this).fetch();
  }
});
},{"../../tpl/footer":16,"../models/Version":12}],14:[function(require,module,exports){
module.exports = Ractive.extend({
  template: require('../../tpl/navigation'),
  onconstruct: function() {
    this.data.isLogged = !!userModel.isLogged();
  }
});
},{"../../tpl/navigation":19}],15:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-md-12"},"f":[{"t":7,"e":"h1","f":[{"t":7,"e":"img","a":{"src":"http://oi62.tinypic.com/24npvgi.jpg","class":"img-responsive"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"page-header"},"f":[{"t":7,"e":"h1","f":["Find Mentors"]}]}," ",{"t":7,"e":"form","a":{"class":"form-horizontal","onsubmit":"return false;"},"f":[{"t":4,"n":50,"r":"loading","f":[{"t":7,"e":"p","f":["Loading. Please wait."]}]},{"t":4,"n":51,"f":[{"t":7,"e":"h4","f":["Please set your desired mentor's username, position, or ladder rank:"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"inputCri","value":[{"t":2,"r":"inputCri"}]}}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"input","a":{"type":"button","class":"btn btn-primary","value":"Find"},"v":{"click":"find"}}],"r":"loading"}]}," ",{"t":4,"n":50,"x":{"r":["foundMentors"],"s":"_0!==null"},"f":[{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-lg-12"},"f":[{"t":7,"e":"div","a":{"class":"bs-component"},"f":[{"t":4,"n":52,"r":"foundMentors","f":[{"t":7,"e":"div","a":{"class":"junbotron"},"f":[{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-sm-8 col-md-8 col-lg-8"},"f":[{"t":7,"e":"h4","f":[{"t":2,"r":"userName"}," ",{"t":2,"r":"rank"}," ",{"t":2,"r":"position"}]}]}," ",{"t":7,"e":"div","a":{"class":"col-sm-3 col-md-3 col-lg-3"},"f":[{"t":7,"e":"input","a":{"type":"button","class":"btn btn-primary btn-sm","value":"Add as Mentor"},"v":{"click":{"n":"add","d":[{"t":2,"r":"id"}]}}}]}]}]}]}]}]}]}]},{"t":4,"n":50,"x":{"r":["message"],"s":"_0!==\"\""},"f":[{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"alert alert-dismissible alert-success"},"f":[{"t":7,"e":"p","f":[{"t":3,"r":"message"}]}]}]},{"t":7,"e":"appfooter"}]}
},{}],16:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"footer","f":["Version: ",{"t":2,"r":"version"}]}]}
},{}],17:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-md-12"},"f":[{"t":7,"e":"h1","f":[{"t":7,"e":"img","a":{"src":"http://oi60.tinypic.com/evctbk.jpg","class":"img-responsive"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"page-header"},"f":[{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-lg-8 col-md-7 col-sm-6"},"f":[{"t":7,"e":"h1","f":["Welcome to LOLMentors"]}," ",{"t":7,"e":"p","a":{"class":"lead"},"f":["A website designed to help fellow summoners improve"]}]}]}]}," ",{"t":7,"e":"appfooter"}]}
},{}],18:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-md-12"},"f":[{"t":7,"e":"h1","f":[{"t":7,"e":"img","a":{"src":"http://oi57.tinypic.com/eimfs3.jpg","class":"img-responsive"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"page-header"},"f":[{"t":7,"e":"h1","f":["Login"]}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-lg-12"},"f":[{"t":7,"e":"div","a":{"class":"well bs-component"},"f":[{"t":7,"e":"form","a":{"class":"form-horizontal"},"f":[{"t":7,"e":"fieldset","f":[{"t":4,"n":50,"x":{"r":["error"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"alert alert-dismissible alert-danger"},"f":[{"t":2,"r":"error"}]}]}," ",{"t":4,"n":50,"x":{"r":["success"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"alert alert-dismissible alert-success"},"f":[{"t":3,"r":"success"}]}]},{"t":4,"n":51,"f":[{"t":7,"e":"legend","f":["Please Enter Your Information"]}," ",{"t":7,"e":"label","a":{"for":"userName","class":"control-label"},"f":["Username"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"userName","value":[{"t":2,"r":"userName"}]}}," ",{"t":7,"e":"label","a":{"for":"password","class":"control-label"},"f":["Password"]}," ",{"t":7,"e":"input","a":{"type":"password","class":"form-control","id":"password","value":[{"t":2,"r":"password"}]}}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"input","a":{"type":"button","class":"btn btn-primary","value":"Login"},"v":{"click":"login"}}],"x":{"r":["success"],"s":"_0&&_0!=\"\""}}]}]}]}]}]}," ",{"t":7,"e":"appfooter"}]}
},{}],19:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"div","a":{"class":"navbar navbar-default navbar-fixed-top"},"f":[{"t":7,"e":"div","a":{"class":"container"},"f":[{"t":7,"e":"div","a":{"class":"navbar-header"},"f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"home"}},"a":{"class":"navbar-brand"},"f":["LOLMentors"]}]}," ",{"t":7,"e":"div","a":{"class":"navbar-collapse collapse"},"f":[{"t":7,"e":"ul","a":{"class":"nav navbar-nav"},"f":[{"t":4,"n":50,"x":{"r":["isLogged"],"s":"!_0"},"f":[{"t":7,"e":"li","f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"register"}},"f":["Register"]}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"login"}},"f":["Login"]}]}]},{"t":4,"n":51,"f":[{"t":7,"e":"li","f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"profile"}},"f":["Profile"]}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"find-mentors"}},"f":["Find Mentors"]}]}," ",{"t":7,"e":"li","a":{"class":"right"},"f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"logout"}},"f":["Logout"]}]}],"x":{"r":["isLogged"],"s":"!_0"}}]}]}]}]}]}
},{}],20:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-md-12"},"f":[{"t":7,"e":"h1","f":[{"t":7,"e":"img","a":{"src":"http://oi62.tinypic.com/24npvgi.jpg","class":"img-responsive"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"page-header"},"f":[{"t":7,"e":"h1","f":["Profile"]}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-lg-12"},"f":[{"t":7,"e":"div","a":{"class":"well bs-component"},"f":[{"t":7,"e":"form","a":{"class":"form-horizontal"},"f":[{"t":7,"e":"fieldset","f":[{"t":4,"n":50,"x":{"r":["error"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"alert alert-dismissible alert-danger"},"f":[{"t":2,"r":"error"}]}]}," ",{"t":4,"n":50,"x":{"r":["success"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"alert alert-dismissible alert-success"},"f":[{"t":3,"r":"success"}]}]},{"t":4,"n":51,"f":[{"t":7,"e":"legend","f":["Welcome ",{"t":2,"r":"userName"}]}," ",{"t":7,"e":"label","a":{"for":"email","class":"control-label"},"f":["E-mail"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"email","value":[{"t":2,"r":"email"}]}}," ",{"t":7,"e":"label","a":{"for":"ingame-name","class":"control-label"},"f":["In-Game name"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"ingame-name","value":[{"t":2,"r":"ingameName"}]}}," ",{"t":7,"e":"label","a":{"for":"rank","class":"control-label"},"f":["Ladder Rank"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"rank","value":[{"t":2,"r":"rank"}]}}," ",{"t":7,"e":"label","a":{"for":"position","class":"control-label"},"f":["Favourite Position"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"position","value":[{"t":2,"r":"position"}]}}," ",{"t":7,"e":"label","a":{"for":"password","class":"control-label"},"f":["Change password"]}," ",{"t":7,"e":"input","a":{"type":"password","class":"form-control","id":"password","value":[{"t":2,"r":"password"}]}}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"input","a":{"type":"button","class":"btn btn-primary","value":"Update"},"v":{"click":"updateProfile"}}," ",{"t":7,"e":"input","a":{"type":"button","class":"btn btn-primary","value":"Delete account"},"v":{"click":"deleteProfile"}}],"x":{"r":["success"],"s":"_0&&_0!=\"\""}}]}]}]}]}]}," ",{"t":7,"e":"appfooter"}]}
},{}],21:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-md-12"},"f":[{"t":7,"e":"h1","f":[{"t":7,"e":"img","a":{"src":"http://oi57.tinypic.com/eimfs3.jpg","class":"img-responsive"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"page-header"},"f":[{"t":7,"e":"h1","f":["Register"]}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"col-lg-12"},"f":[{"t":7,"e":"div","a":{"class":"well bs-component"},"f":[{"t":7,"e":"form","a":{"class":"form-horizontal"},"f":[{"t":7,"e":"fieldset","f":[{"t":4,"n":50,"x":{"r":["error"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"alert alert-dismissible alert-danger"},"f":[{"t":2,"r":"error"}]}]}," ",{"t":4,"n":50,"x":{"r":["success"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"alert alert-dismissible alert-success"},"f":[{"t":3,"r":"success"}]}]},{"t":4,"n":51,"f":[{"t":7,"e":"legend","f":["Please Enter Your Information"]}," ",{"t":7,"e":"label","a":{"for":"userName","class":"control-label"},"f":["Username"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"userName","value":[{"t":2,"r":"userName"}]}}," ",{"t":7,"e":"label","a":{"for":"ingameName","class":"control-label"},"f":["In-game name"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"ingameName","value":[{"t":2,"r":"ingameName"}]}}," ",{"t":7,"e":"label","a":{"for":"rank","class":"control-label"},"f":["Ladder Rank"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"rank","value":[{"t":2,"r":"rank"}]}}," ",{"t":7,"e":"label","a":{"for":"position","class":"control-label"},"f":["Favourite Position"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"position","value":[{"t":2,"r":"position"}]}}," ",{"t":7,"e":"label","a":{"for":"email","class":"control-label"},"f":["Email"]}," ",{"t":7,"e":"input","a":{"type":"text","class":"form-control","id":"email","value":[{"t":2,"r":"email"}]}}," ",{"t":7,"e":"label","a":{"for":"password","class":"control-label"},"f":["Password"]}," ",{"t":7,"e":"input","a":{"type":"password","class":"form-control","id":"password","value":[{"t":2,"r":"password"}]}}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"input","a":{"type":"button","class":"btn btn-primary","value":"Register"},"v":{"click":"register"}}],"x":{"r":["success"],"s":"_0&&_0!=\"\""}}]}]}]}]}]}," ",{"t":7,"e":"appfooter"}]}
},{}]},{},[6])