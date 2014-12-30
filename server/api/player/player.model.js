'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('player', {
    elo: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });
};
