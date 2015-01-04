/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var sqldb = require('../sqldb');
var User = sqldb.User;
var Game = sqldb.Game;
var Player = sqldb.Player;
var Kill = sqldb.Kill;

var forceUpdate = false;
User.sync({ force: forceUpdate })
  .then(function() {
    Game.sync({ force: forceUpdate });
    Player.sync({ force: forceUpdate });
    Kill.sync({ force: forceUpdate });
  })
  .then(function() {
    User.destroy();
    Game.destroy();
    Player.destroy();
    Kill.destroy();
  })
  .then(function() {

    // Create users
    User.bulkCreate([{
      provider: 'local',
      role: 'admin',
      email: 'thomasteinke@gmail.com',
      password: 'thomas'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Thomas',
      email: 'exyphnos@gmail.com',
      password: 'thomas'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Elliot',
      email: 'elliotfiske@gmail.com',
      password: 'elliot'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin'
    }])
    .then(function() {
      User.findAll().then(function(users) {

        // Create MB Game
        Game.create({
          name: 'Mustang Band',
          active: true,
          GameMasterId: users[0].getDataValue('_id')
        }).complete(function(err, game) {
          
          // Add Thomas and Elliot to game
          users[0].addGame(game).then(function(thomas) {
            thomas.setDataValue('elo', 1400);
            thomas.save().then(function() {
              users[1].addGame(game).then(function(elliot) {

                // Thomas killed Elliot!
                game.createKill({
                  killerUserId: thomas.getDataValue('userId'),
                  victimUserId: elliot.getDataValue('userId')
                });

                // Elliot got him back!
                game.createKill({
                  killerUserId: elliot.getDataValue('userId'),
                  victimUserId: thomas.getDataValue('userId')
                });
              });
            });
          });
        });

        // Create random game
        Game.create({
          name: 'Random Band',
          active: true,
          GameMasterId: users[1].getDataValue('_id')
        });
      });
    });
  });