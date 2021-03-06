/*  
  Primary server side component which handles all REST API requests.
*/

var sha1 = require('sha1');
var ObjectId = require('mongodb').ObjectID;
var disableUpdate = false;

var response = function(result, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(result) + '\n');
};
var error = function(message, res) {
  res.writeHead(500, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({error: message}) + '\n');
};

/*
  Database declarations.
  Compose.io remote mongodb is used.
*/

var MongoClient = require('mongodb').MongoClient;
var database;
var getDatabaseConnection = function(callback) {
  if(database) {
    callback(database);
    return;
  } else {
    MongoClient.connect('mongodb://lolmentors:lolmentorspw@dogen.mongohq.com:10032/LOLMentor-nodejs', function(err, db) {
      if(err) {
        throw err;
      };
      database = db;
      callback(database);
    });
  }
};

/*
  Helper function which sets the current logged in user.
*/

var getUser = function(callback, req, res) {
  getDatabaseConnection(function(db) {
    var collection = db.collection('users');
    collection.find({
      userName: req.session.user.userName
    }).toArray(function(err, result) {
      if (result.length === 0) {
        error('User not found', res);
      } else {
        callback(result[0]);
      }
    });
  });
};

/*
  Helper function which handles the fetching of POST requests.
  GET requests are handled defaultly on fetch.
*/

var querystring = require('querystring');
var processPOSTRequest = function(req, callback) {
  var body = '';
  req.on('data', function (data) {
    body += data;
  });
  req.on('end', function () {
    callback(querystring.parse(body));
  });
};

/*
  All the REST API calls are handled below.
  Details on each can be found in the documentation.
  Aids used: "Node.js By Example"
*/
var Router = require('../frontend/js/lib/Router')();
Router
.add('api/version', function(req, res) {
  response({
    version: '1.0'
  }, res);
})
.add('api/user/login', function(req, res) {
  processPOSTRequest(req, function(data) {
    if(!data.userName || data.userName === '') {
      error('Invalid or missing username.', res);
    } else if(!data.password || data.password === '') {
      error('Please fill in your password.', res);
    } else {
      getDatabaseConnection(function(db) {
        var collection = db.collection('users');
        collection.find({ 
          userName: data.userName,
          password: sha1(data.password)
        }).toArray(function(err, result) {
          if(result.length === 0) {
            error('Wrong username or password', res);
          } else {
            var user = result[0];
            delete user.password;
            delete user._id;
            req.session.user = user;
            response({
              success: 'OK',
              user: user
            }, res);
          }
        });
      });
    }
  });
})
.add('api/user/logout', function(req, res) {
  delete req.session.user;
  response({
    success: 'OK'
  }, res);
})
.add('api/user', function(req, res) {
  switch(req.method) {
    case 'GET':
      if(req.session && req.session.user) {
        response(req.session.user, res);
      } else {
        response({}, res);
      }
    break;
    case 'PUT':
      processPOSTRequest(req, function(data) {
        if(!data.email || data.email === '') {
          error('Please fill in your e-mail.', res);
        } else if(!data.ingameName || data.ingameName === '') {
          error('Please fill in your in-game name.', res);
        } else if(data.rank != 'Bronze' && data.rank != 'Silver' && data.rank != 'Gold' && data.rank != 'Platinum' && data.rank != 'Diamond' && data.rank != 'Master' && data.rank != 'Challenger') {
          error('Invalid ladder rank, Choose a ladder rank from the following: Bronze, Silver, Gold, Platinum, Diamond, Master, Challenger', res);
        } else if(data.position != "Top" && data.position != "Mid" && data.position != "Jungle" && data.position != "ADC" && data.position != "Support") {
          error('Invalid position. Choose a position from the following: Top, Mid, Jungle, ADC, Support', res);
        } else if(disableUpdate == true) {
          error('Sorry, due to a bug, update profile is disabled', res);
        } else {
          getDatabaseConnection(function(db) {
            var collection = db.collection('users');
            if(data.password) {
              data.password = sha1(data.password);
            }
            collection.update(
              { userName: req.session.user.userName },
              { $set: data }, 
              function(err, result) {
                if(err) {
                  err('Error updating the data.');
                } else {
                  if(data.password) delete data.password;
                  for(var key in data) {
                    req.session.user[key] = data[key];
                  }
                  response({
                    success: 'OK'
                  }, res);
                }
              }
            );
          });
        }
      });
    break;
    case 'POST':
      processPOSTRequest(req, function(data) {
        if(!data.userName || data.userName === '') {
          error('Please fill in your username.', res);
        } else if(!data.ingameName || data.ingameName === '') {
          error('Please fill in your in-game name.', res);
        } else if(!data.email || data.email === '') {
          error('Invalid or missing email.', res);
        } else if(!data.password || data.password === '') {
          error('Invalid or missing password.', res);
        } else if(data.rank != 'Bronze' && data.rank != 'Silver' && data.rank != 'Gold' && data.rank != 'Platinum' && data.rank != 'Diamond' && data.rank != 'Master' && data.rank != 'Challenger') {
          error('Invalid ladder rank. Choose a ladder rank from the following: Bronze, Silver, Gold, Platinum, Diamond, Master, Challenger', res);
        } else if(data.position != "Top" && data.position != "Mid" && data.position != "Jungle" && data.position != "ADC" && data.position != "Support") {
          error('Invalid position. Choose a position from the following: Top, Mid, Jungle, ADC, Support', res);
        } else {
          getDatabaseConnection(function(db) {
            var collection = db.collection('users');
            data.password = sha1(data.password);
            collection.insert(data, function(err, docs) {
              response({
                success: 'OK'
              }, res);
            });
          });
        }
      });
    break;
  };
})
.add('api/mentors/find', function(req, res) {
  if(req.session && req.session.user) {
    if (req.method === 'POST') {
      var findMentors = function(db, searchTarget, currentMentors) {
        var collection = db.collection('users');
        var regExp = new RegExp(searchTarget, 'gi');
        var excludeCurrent = [req.session.user.userName];
        currentMentors.forEach(function(value, index, arr) {
          arr[index] = ObjectId(value);
        });
        collection.find({
          $and: [
              {
                $or: [
                  { rank : regExp },
                  { userName: regExp },
                  { position: regExp }
                ]
              },
              { userName: { $nin: excludeCurrent } },
              { _id: { $nin: currentMentors } }
          ]
        }).toArray(function(err, result) {
          var foundMentors = [];
          for (var i = 0; i<result.length; i++) {
            foundMentors.push({
              id: result[i]._id,
              userName: result[i].userName,
              rank: result[i].rank,
              position: result[i].position
            });
          };
          response({
            mentors: foundMentors
          }, res);
        });
      }
      processPOSTRequest(req, function(data) {
        getDatabaseConnection(function(db) {
          getUser(function(user) {
            findMentors(db, data.searchTarget, user.mentors || []);
          }, req, res);
        });
      });
    } else {
      error('Invalid POST request.', res);
    }
  } else {
    error('This method is only accessible when logged in.', res);
  }
})
.add('api/mentors/add', function(req, res) {
  if (req.session && req.session.user) {
    if (req.method === 'POST') {
      var mentorID;
      var updateUser = function(db, mentorID) {
        var collection = db.collection('users');
          collection.update(
            { userName: req.session.user.userName },
            { $push: { mentors: mentorID} },
            updateMentorship
          );
      };
      var updateMentorship = function(err, result) {
        if(err) {
          error('Error, could not update mentorship status', res);
        } else {
          disableUpdate = true;
          response({
            success: 'OK'
          }, res);
        }
      };
      processPOSTRequest(req, function(data) {
        getDatabaseConnection(function(db) {
          updateUser(db, data.id);
        });
      });
    } else {
      error('Invalid POST request.', res);
    }
  } else {
    error('This method is only accessible when logged in.', res);
  }
}) 
.add('api/mentors', function(req, res) {
  if(req.session && req.session.user) {
    getUser(function(user) {
      if(!user.mentors || user.mentors.length === 0) {
        return response({ mentors: [] }, res);
      }
      disableUpdate = true;
      user.mentors.forEach(function(value, index, arr) {
        arr[index] = ObjectId(value);
      });
      getDatabaseConnection(function(db) {
        var collection = db.collection('users');
        collection.find({
          _id: { $in: user.mentors }
        }).toArray(function(err, result) {
          result.forEach(function(value, index, arr) {
            arr[index].id = value.id;
          });
          response({
            mentors: result
          }, res);
        });
      });
    }, req, res);
  } else {
    error('This method is only accessible when logged in.', res);
  }
})
.add('api/posts/:id', function(req, res, param) {
  var user;
  if (req.session && req.session.user) {
    user = req.session.user;
  } else {
    error('This method is only accessible when logged in.', res);
    return;
  }
  switch(req.method) {
    case 'GET': 
      getDatabaseConnection(function(db) {
        var query = param && param.id ? {
          _id: ObjectId(param.id)
        } : {};
        var collection = db.collection('posts');
        collection.find({
          $query: query,
          $orderby: {
            date: -1
          }
        }).toArray(function(err, result) {
          result.forEach(function(value, index, arr) {
            arr[index].id = value._id;
          });
          response({
            posts: result
          }, res);
        });
      });
      break;
    case 'POST':
        var formidable = require('formidable');
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, formData, files) {
          var data = {
            title: formData.title,
            details: formData.details,
            type: formData.type
          };
          if (!data.title || data.title === '') {
            error('Cannot post without a title.', res);
          } else if (!data.details || data.details === '') {
            error('Cannot post without some details.', res);
          } else if (data.type != 'Mentor' && data.type != 'Mentee' && data.type != 'Others') {
            error('Invalid type, choose from - Mentor, Mentee, or Others', res);
          } else {
            var processPost = function() {
              response({
                success: 'OK'
              }, res);
            }
            getDatabaseConnection(function(db) {
              getUser(function(user) {
                var collection = db.collection('posts');
                data.userId = user._id.toString();
                data.userName = user.userName;
                data.date = new Date();
                collection.insert(data, processPost);
              }, req, res);
            });
          }
        });
      break;
    };
})
.add('api/posts', function(req, res) {
  var user;
  if (req.session && req.session.user) {
    user = req.session.user;
  } else {
    error('This method is only accessible when logged in.', res);
    return;
  }
  switch(req.method) {
    case 'GET': 
      getDatabaseConnection(function(db) {
        var collection = db.collection('posts');
        collection.find({
          $query: {},
          $orderby: {
            date: -1
          }
        }).toArray(function(err, result) {
          result.forEach(function(value, index, arr) {
            arr[index].id = value._id;
          });
          response({
            posts: result
          }, res);
        });
      });
      break;
    case 'POST':
        var formidable = require('formidable');
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, formData, files) {
          var data = {
            title: formData.title,
            details: formData.details,
            type: formData.type
          };
          if (!data.title || data.title === '') {
            error('Cannot post without a title.', res);
          } else if (!data.details || data.details === '') {
            error('Cannot post without some details.', res);
          } else if (data.type != 'Mentor' && data.type != 'Mentee' && data.type != 'Others') {
            error('Invalid type, choose from - Mentor, Mentee, or Others', res);
          } else {
            var processPost = function() {
              response({
                success: 'OK'
              }, res);
            }
            getDatabaseConnection(function(db) {
              getUser(function(user) {
                var collection = db.collection('posts');
                data.userId = user._id.toString();
                data.userName = user.userName;
                data.date = new Date();
                collection.insert(data, processPost);
              }, req, res);
            });
          }
        });
      break;
    };
})
.add(function(req, res) {
  response({
    success: true
  }, res);
})
     
module.exports = function(req, res) {
  Router.check(req.url, [req, res]);
}