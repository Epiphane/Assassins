'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kill', {
    points: DataTypes.INTEGER,
    round: DataTypes.INTEGER,
    dateTime: DataTypes.DATE
  }, {
    hooks: {
      beforeCreate: function(kill, fields, fn) {
        kill.getGame().then(function(game) {
          kill.getKiller().then(function(killer) {
            kill.getVictim().then(function(victim) {
              if(!game || !killer || !victim)
                throw 'Game, Killer, and Victim required';
              
              kill.setDataValue('dateTime', new Date());

              var rightNow = new Date();
              rightNow.setHours(rightNow.getHours() + 8);
              killer.setDataValue('waitTime', rightNow);

              kill.setDataValue('round', game.getDataValue('round'));

              // Elo adjustment credits:
              // http://en.wikipedia.org/wiki/Elo_rating_system#Theory
              var rank = Math.pow(10, (killer.elo - victim.elo) / 400);
              kill.setDataValue('points', Math.round(game.k / (1 + rank)));

              // Adjust Elo
              killer.elo += kill.getDataValue('points');
              victim.elo -= kill.getDataValue('points');

              // Save everything
              killer.save();
              victim.save();

              fn();
            });
          });
        });
      }
    }
  });
};
