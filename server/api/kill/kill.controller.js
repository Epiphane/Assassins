'use strict';

var _ = require('lodash');
var sqldb = require('../../sqldb')
var User = sqldb.User;
var Kill = sqldb.Kill;

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).json(err.errors || err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
  };
}

// Gets list of kills from the DB.
exports.index = function(req, res) {
  if(req.game) {
    req.game.getKills()
      .then(responseWithResult(res))
      .catch(handleError(res));
  }
  else {
    Kill.findAll()
      .then(responseWithResult(res))
      .catch(handleError(res));
  }
};

exports.show = function(req, res) {
  Kill.find({
    _id: req.params.id
  })
    .then(function(kill) {
      if(kill) {
        res.status(200).json(kill);
      }
      else {
        res.status(404).end('Kill not found');
      }
    })
    .catch(handleError(res));
};

exports.create = function(req, res) {
  if(!req.game)
    res.status(404).end();
  else {
    req.game.findUsers({
      where: {
        _id: req.params.pid
      }
    }).then(function(killer) {
      if(killer) {
        req.game.createKill({
          killerUserId: req.user._id,
          victimUserId: req.params.pid
        })
          .then(responseWithResult(res, 201))
          .catch(handleError(res));
      }
      else
        handleError(res, 404)({
          message: 'User is not playing this game'
        });
    });
  }
};

