'use strict';

var _ = require('lodash');
var sqldb = require('../../sqldb')
var Game = sqldb.Game;

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

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function validateGameMaster(req, res) {
  return function(game) {
    if(game.getDataValue('GameMasterId') !== req.user._id) {
      res.status(401).end('You are not the Game Master');
      return null;
    }
    return game;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    return entity.updateAttributes(updates)
      .then(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(function() {
          return res.status(204).end();
        });
    }
  };
}

// Get list of things
exports.index = function(req, res) {
  Game.findAll()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Get a single thing
exports.show = function(req, res) {
  Game.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(function(game) {
      if(game) {
        game.getUsers({
          order: 'player.elo'
        }).then(function(users) {
          game.dataValues.leaderboard = _.map(users, function(u) {
            return _.merge(u.player, { 
              dataValues: {
                name: u.getDataValue('name') || u.getDataValue('email')
              }
            });
          });

          game.getRound().then(function(round) {
            game.dataValues.round = round;
            
            res.json(game);
          });
        });
      }
    })
    .catch(handleError(res));
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  req.body.GameMasterId = req.user._id;
  Game.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }

  Game.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(validateGameMaster(req, res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Game.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(validateGameMaster(req, res))
    .then(removeEntity(res))
    .catch(handleError(res));
};

exports.validGame = function(req, res, next) {
  Game.find({
    where: {
      _id: req.params.gid
    }
  })
    .then(handleEntityNotFound(res))
    .then(function(game) {
      req.game = game;
      next();
    })
    .catch(handleError(res));
};

exports.isGameMaster = function(req, res, next) {
  if(req.game.getDataValue('GameMasterId') !== req.user.getDataValue('_id')) {
    res.status(401).json({
      message: 'You are not the Game Master'
    });
  }
  else
    next();
}

exports.round = {
  show: function(req, res) {
    req.game.getRound()
      .then(responseWithResult(res))
      .catch(handleError(res));
  },
  create: function(req, res) {
    req.game.createRound()
      .then(responseWithResult(res, 201))
      .catch(handleError(res));
  }
};