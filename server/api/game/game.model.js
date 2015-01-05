'use strict';

var _ = require('lodash');
if(typeof(Promise) === 'undefined')
  var Promise = require('promise');

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
    organization: DataTypes.STRING,
    startDate: {
      type: DataTypes.DATE,
      get: function() {
        return this.dataValues.startDate + 8;
      }
    },
    endDate: {
      type: DataTypes.DATE,
      get: function() {
        return this.dataValues.endDate + 8;
      }
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
      getLeaders: function(limit) {
        var self = this;
        return this.getUsers({
          order: 'player.elo'
        }).then(function(users) {
          return _.map(users, function(u) {
            return _.merge(u.player, { 
              dataValues: {
                name: u.getDataValue('name') || u.getDataValue('email')
              }
            });
          }).slice(0, limit);
        });
      },
      getRound: function() {
        var round = this.getDataValue('round');
        if(round) {
          return this.getUsers({
            where: {
              'player.active': true
            }
          }).then(function(users) {
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

          round = this.getDataValue('round');
          this.save();

          var self = this;
          this.getUsers({
            where: {
              'player.active': true
            }
          })
            .then(function(users) {
              return _.sortBy(users, function(user) {
                return user.player.elo + Math.sin(user._id);
              });
            })
            .then(function(users) {
              var rankSize;
              if (self.getDataValue('restrictRanksOrSize')) {
                var ranks = self.getDataValue('restriction');
                rankSize = Math.round(ranks / users.length);
              }
              else
                rankSize = self.getDataValue('restriction');

              // Give players their ranks
              var rank      = 1,
                  spotsLeft = rankSize;
              _.forEachRight(users, function(user) {
                var oldRank = user.player.rank;
                user.player.rank = rank;

                if((--spotsLeft) === 0) {
                  rank ++;
                  spotsLeft = rankSize;
                }

                if(user.player.changed('rank'))
                  user.player.save();
              });

              fulfill(_.merge({
                id: round
              }, _.groupBy(users, function(user) {
                return user.player.rank
              })));
            });
        }.bind(this));
      }
    }
  });
};
