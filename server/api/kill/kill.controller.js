'use strict';

var _ = require('lodash');
var sqldb = require('../../sqldb')
var User = sqldb.User;
var Kill = sqldb.Kill;
if(process.env.SENDGRID_USERNAME) {
  var fs = require('fs');
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
    req.game.getUsers({
      where: {
        _id: req.user._id
      }
    }).then(function(killer) {
      killer = killer[0];
      req.game.getUsers({
        where: {
          _id: req.params.pid
        }
      }).then(function(victim) {
        console.log(killer);
        if(victim) {
          victim = victim[0];
          if(new Date(killer.dataValues.player.getDataValue('waitTime')) < new Date()) {
            req.game.createKill({
              killerUserId: req.user._id,
              victimUserId: req.params.pid
            })
              .then(function(kill) {
                if(process.env.SENDGRID_USERNAME) {
                  kill.getVictim().then(function(victimPlayer) {
                    fs.readFile(__dirname + '/killed.html', function(err, html) {
                      if (err) { return console.error(err); }
                      sendgrid.send({
                        to:       victim.getDataValue('email'),
                        from:     'donotreply@kill-your-friends.herokuapp.com',
                        subject:  'Assassins: Killed by ' + req.user.name,
                        html:     _.template(html)({
                          killer: req.user,
                          victim: victimPlayer
                        })
                      }, function(err, json) {
                        if (err) { return console.error(err); }
                        console.log('Kill email sent to ' +
                          victim.getDataValue('name') + '(' +
                          victim.getDataValue('email') + ')');
                      });
                    });
                  });
                }

                return kill;
              })
              .then(responseWithResult(res, 201))
              .catch(handleError(res));
          }
          else {
            handleError(res, 400)({
              message: 'You can\'t kill yet! Give it a rest!'
            });
          }
        }
        else
          handleError(res, 404)({
            message: 'User is not playing this game'
          });
      })
    });
  }
};

