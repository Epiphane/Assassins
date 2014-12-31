'use strict';

var _ = require('lodash');

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

// Gets list of players from the DB.
exports.index = function(req, res) {
  req.game.getUsers({
    where: {
      'player.active': true
    }
  })
    .then(function(players) {
      res.json(players);
    })
    .catch(handleError(res));
};

exports.create = function(req, res) {
  req.user.hasGame(req.game).then(function(exists) {
    var result;
    if(exists) {
      result = req.user.setGames([req.game], {
        active: false
      });
    }
    else {
      result = req.user.addGame(req.game);
    }

    result.then(function() {
      res.status(201).end('Game Joined');
    }).catch(handleError(res));
  });
};

exports.destroy = function(req, res) {
  req.user.setGames([req.game], {
    active: false
  })
    .then(function() {
      res.status(200).end('Game Left');
    })
    .catch(handleError(res));
};