'use strict';

var _ = require('lodash');
var https = require('https');
var sqldb = require('../../sqldb');
var User = sqldb.User;
var Player = sqldb.Player;
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.json(statusCode, err);
  };
};

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.send(statusCode, err);
  };
}

function respondWith(res, statusCode) {
  statusCode = statusCode || 200;
  return function() {
    res.send(statusCode);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.findAll({
    attributes: [
      '_id',
      'name',
      'email',
      'role',
      'provider'
    ]
  })
    .then(function(users) {
      res.json(200, users);
    })
    .catch(handleError(res));
};

/**
 * Creates a new user
 */
exports.create = function(req, res, next) {
  var newUser = User.build(req.body);
  newUser.setDataValue('provider', 'local');
  newUser.setDataValue('role', 'user');
  newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresInMinutes: 60 * 5
      });
      res.json({ token: token });
    })
    .catch(validationError(res));
};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
  var userId = req.params.id;

  User.find({
    where: {
      _id: userId
    }
  })
    .then(function(user) {
      if (!user) {
        return res.send(404);
      }
      res.json(user.profile);
    })
    .catch(function(err) {
      return next(err);
    });
};

exports.getGames = function(req, res) {
  User.find({
    _id: req.params.id
  })
    .then(function(user) {
      user.getGames().then(function(games) {
        res.json(games);
      });
    })
    .catch(handleError(res));
};

exports.getFriends = function(req, res) {
  User.find({
    _id: req.user._id
  })
    .then(function(user) {
      var fb = JSON.parse(user.getDataValue('facebook'));

      var fbReq = https.request({
          hostname: 'graph.facebook.com',
          method: 'GET',
          path: '/v2.0/515340825177583/members?access_token=' + fb.accessToken
      }, function(fbRes) {
          var output = '';
          fbRes.setEncoding('utf8');

          fbRes.on('data', function(chunk) {
              output += chunk;
          });

          fbRes.on('end', function() {
            res.json(JSON.parse(output));
          });

      });

      fbReq.on('error', function(err) {
          console.error(err);
      });

      fbReq.end();
    })
    .catch(handleError(res));
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.destroy({ _id: req.params.id })
    .then(respondWith(res, 204))
    .catch(handleError(res));
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.find({
    where: {
      _id: userId
    }
  })
    .then(function(user) {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(respondWith(res, 200))
          .catch(validationError(res));
      } else {
        return res.send(403);
      }
    });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;

  User.find({
    where: {
      _id: userId
    },
    attributes: [
      '_id',
      'name',
      'email',
      'role',
      'provider'
    ]
  })
    .then(function(user) { // don't ever give out the password or salt
      if (!user) { return res.json(401); }
      res.json(user);
    })
    .catch(function(err) {
      return next(err);
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
