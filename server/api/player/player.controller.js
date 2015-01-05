'use strict';

var fs = require('fs');
var crypto = require('crypto');
var _ = require('lodash');
var User = require('../../sqldb').User;
if(process.env.SENDGRID_USERNAME) {
  var sendgrid  = require('sendgrid')(process.env.SENDGRID_USERNAME,
    process.env.SENDGRID_PASSWORD);
}

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

exports.me = function(req, res) {
  req.game.getUsers({
    where: {
      'player.active': true,
      'player.userId': req.user._id
    }
  })
    .then(function(player) {
      res.json(player);
    })
    .catch(handleError(res));
};

exports.create = function(req, res) {
  if(req.user.getDataValue('_id') === req.game.getDataValue('GameMasterId')) {
    if(req.body.player) {
      User.find({
        where: {
          email: req.body.player
        }
      }).then(function(user) {
        var addGameAndSendEmail = function(user, tempPassword) {
          user.addGame(req.game);
        
          if(process.env.SENDGRID_USERNAME) {
            fs.readFile(__dirname + '/added.html', function(err, html) {
              if (err) { return console.error(err); }
              sendgrid.send({
                to:       user.getDataValue('email'),
                from:     'donotreply@kill-your-friends.herokuapp.com',
                subject:  'Assassins: Added to ' + req.game.getDataValue('name'),
                html:     _.template(html)({
                  user: req.user,
                  game: req.game,
                  tempPassword: tempPassword
                })
              }, function(err, json) {
                if (err) { return console.error(err); }
                if(user.getDataValue('name')) {
                  console.log('Intro email sent to ' +
                    user.getDataValue('name') + '(' +
                    user.getDataValue('email') + ')');
                }
                else
                  console.log('Intro email sent to ' +
                    user.getDataValue('email'));
              });
            });
          }

          res.status(201).end(user.name + ' added to game');
        };

        if(!user) { // User doesn't exist, add them
          var tempPassword = crypto.randomBytes(10).toString('base64');
          User.create({
            provider: 'local',
            email: req.body.player,
            password: tempPassword
          }).complete(function(err, user) {
            addGameAndSendEmail(user, tempPassword);
          });
        }
        else {
          user.hasGame(req.game).then(function(exists) {
            if(exists && user.player.active === false) {
              res.status(400).end(user.name + ' left this game!');
            }
            else {
              addGameAndSendEmail(user);
            }
          });
        }
      });
    }
  }
  req.user.hasGame(req.game).then(function(exists) {
    var result;
    if(exists) {
      result = req.user.setGames([req.game], {
        active: true
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