'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('player', {
    elo: {
      type: DataTypes.INTEGER,
      defaultValue: 1200
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    rank: DataTypes.INTEGER,
    waitTime: DataTypes.DATE
  });
};
