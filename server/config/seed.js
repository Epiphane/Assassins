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
      name: 'Thomas',
      email: 'exyphnos@gmail.com',
      password: 'thomas'
    }, {
      provider: 'local',
      name: 'Elliot',
      email: 'elliotfiske@gmail.com',
      password: 'elliot'
    }])
    .then(function() {
      User.findAll().then(function(users) {

        // Create MB Game
        var today = new Date();
        today.setDate(today.getDate() + 1);
        var endOfQuarter = new Date();
        endOfQuarter.setDate(endOfQuarter.getDate() + 60);
        Game.create({
          name: 'Kill your friends',
          organization: 'Mustang Band',
          groupId: 855038044552257,
          rules: 'Honor system applies. Your victim gets an email whenever ' +
            'you kill them, so be honest please.\n\n' +
            'No shooting during jobs, or band.',
          active: true,
          startDate: today,
          endDate: endOfQuarter,
          GameMasterId: users[0].getDataValue('_id')
        }).complete(function(err, game) {
          // Add Thomas and Elliot to game
          users[0].addGame(game).then(function(thomas) {
              users[1].addGame(game).then(function(elliot) {
                // game.createRound();
                return;

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
    });
  });
