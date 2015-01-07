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
          rules: '<i class="fa fa-heart"></i>  <b>Honor System</b> Killer reports kills.  Tell the truth!  Strohm is watching. <br><br>' +
            '<i class="fa fa-check-circle-o"></i>  <b>Safe Zones:</b> <br>' +
            '     <div class="indent"><i class="fa fa-institution"></i>  <b>Work</b> You can\'t be killed while working </div>' +
            '     <div class="indent"><i class="fa fa-music"></i>    <b>Band</b> You can\'t be killed within 20 minutes of any Band class (before or after) </div> <br> ' +
            '     <i class="fa fa-bar-chart"></i> <b>Scoring</b> Your score is tracked through an ELO system.  Kill people with <i>high</i> scores to get <i>more</i> points!',
          active: true,
          startDate: today,
          endDate: endOfQuarter,
          GameMasterId: users[0].getDataValue('_id')
        }).complete(function(err, game) {
          // Add Thomas and Elliot to game
          users[0].addGame(game).then(function(thomas) {
              users[1].addGame(game).then(function(elliot) {
                // game.createRound();

                // Thomas killed Elliot!
                // game.createKill({
                //   killerUserId: thomas.getDataValue('userId'),
                //   victimUserId: elliot.getDataValue('userId')
                // });

                // // Elliot got him back!
                // game.createKill({
                //   killerUserId: elliot.getDataValue('userId'),
                //   victimUserId: thomas.getDataValue('userId')
                // });
              });
          });
        });
      });
    });
  });
