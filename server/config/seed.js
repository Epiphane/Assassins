/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var sqldb = require('../sqldb');
var User = sqldb.User;
var Game = sqldb.Game;
var Player = sqldb.Player;

var forceUpdate = false;
User.sync({ force: forceUpdate })
  .then(function() {
    User.destroy();
  })
  .then(function() {
    Game.sync({ force: forceUpdate })
      .then(function() {
        Game.destroy();
      })
      .then(function() {
        Player.sync({ force: forceUpdate })
        .then(function() {
          Player.destroy();
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
          }, {
            provider: 'local',
            role: 'admin',
            name: 'Admin',
            email: 'admin@admin.com',
            password: 'admin'
          }])
          .then(function() {
            User.findAll().then(function(users) {
              var thomas = users[0];
              var elliot = users[1];

              // Create random game
              Game.create({
                name: 'Random Band',
                active: true,
                GameMasterId: elliot._id
              });

              // Create MB Game
              Game.create({
                name: 'Mustang Band',
                active: true,
                GameMasterId: thomas._id
              }).complete(function(err, game) {
                
                // Add Thomas and Elliot to game
                thomas.addGame(game);
                elliot.addGame(game);
              });
            });
          });
        });
      });
  });