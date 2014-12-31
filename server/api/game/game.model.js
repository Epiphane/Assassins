'use strict';

var _ = require('lodash');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('game', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    k: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      validate: {
        min: 1
      }
    },
    kDecay: {
      type: DataTypes.FLOAT,
      defaultValue: 0.5,
      validate: {
        min: 0,
        max: 1
      }
    },
    restriction: {
      type: DataTypes.INTEGER,
      defaultValue: 5
    },
    restrictRanksOrSize: {
      type: DataTypes.BOOLEAN,
      defaultValue: true // Restrict number of ranks
    },
    round: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    instanceMethods: {
      getRound: function() {
        var round = this.getDataValue('round');
        if(round) {
          return this.getUsers().then(function(users) {
            return _.merge({
              id: round
            }, _.groupBy(users, function(user) { return user.player.rank }));
          });
        }
        else {
          return new Promise(function(fulfill, reject) {
            fulfill('Game has not started!');
          })
        }
      },
      createRound: function() {
        return new Promise(function(fulfill, reject) {
          var round = this.getDataValue('round');
          if(round !== 0) {
            this.setDataValue('round', round + 1);
            this.setDataValue('k',     this.getDataValue('k') * 
                                  (1 - this.getDataValue('kDecay')));
          }
          else
            this.setDataValue('round', 1);

          this.save().then(function() {
            fulfill(this.getRound());
          }.bind(this));
        }.bind(this));
      }
    }
  });
};
