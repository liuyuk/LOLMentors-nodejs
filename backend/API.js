var sha1 = require('sha1');
var ObjectId = require('mongodb').ObjectID;

var response = function(result, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(result) + '\n');
};
var error = function(message, res) {
  res.writeHead(500, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({error: message}) + '\n');
};

var MongoClient = require('mongodb').MongoClient;
var database;
var getDatabaseConnection = function(callback) {
  if(database) {
    callback(database);
    return;
  } else {
    MongoClient.connect('mongodb://127.0.0.1:27017/lolmentors', function(err, db) {
      if(err) {
        throw err;
      };
      database = db;
      callback(database);
    });
  }
};

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

var Router = require('../frontend/js/lib/router')();
Router
.add('api/version', function(req, res) {
  response({
    version: '0.1'
  }, res);
})
.add('api/user/login', function(req, res) {
  processPOSTRequest(req, function(data) {
    if(!data.userName || data.userName === '') {
      error('Invalid or missing username.', res);
    } else if(!data.password || data.password === '') {
      error('Please fill your password.', res);
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
          error('Please fill your e-mail.', res);
        } else if(!data.ingameName || data.ingameName === '') {
          error('Please fill your in-game name.', res);
        } else if(!data.rank || data.rank === '') {
          error('Please fill your ladder rank.', res);
        } else if(!data.position || data.position === '') {
          error('Please fill your favourite position.', res);
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
          error('Please fill your username.', res);
        } else if(!data.ingameName || data.ingameName === '') {
          error('Please fill your in-game name.', res);
        } else if(!data.email || data.email === '') {
          error('Invalid or missing email.', res);
        } else if(!data.password || data.password === '') {
          error('Invalid or missing password.', res);
        } else if(!data.rank || data.rank === '') {
          error('Invalid or missing ladder rank.', res);
        } else if(!data.position || data.position === '') {
          error('Invalid or missing position.', res);
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
    case 'DELETE':
      getDatabaseConnection(function(db) {
        var collection = db.collection('users');
        collection.remove(
          { userName: req.session.user.userName },
          function(err, docs) {
            delete req.session.user;
            response({
              success: 'OK'
            }, res);
          }
        );
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
.add(function(req, res) {
  response({
    success: true
  }, res);
});

module.exports = function(req, res) {
  Router.check(req.url, [req, res]);
}