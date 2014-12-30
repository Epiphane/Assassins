/**
 * Sequelize initialization module
 */

'use strict';

var path = require('path');
var config = require('../config/environment');

var Sequelize = require('sequelize');

var db = {
  Sequelize: Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

db.User = db.sequelize.import(path.join(
  config.root,
  'server',
  'api',
  'user',
  'user.model'
));

// Insert models below
db.Player = db.sequelize.import(path.join(
  config.root,
  'server',
  'api',
  'player',
  'player.model'
));
db.Game = db.sequelize.import(path.join(
  config.root,
  'server',
  'api',
  'game',
  'game.model'
));

db.Game.belongsToMany(db.User, { through: db.Player });
db.User.belongsToMany(db.Game, { through: db.Player });

db.Game.belongsTo(db.User, {
  constraints: false,
  foreignKey: {
    name: 'GameMasterId',
    allowNull: false
  }
});

module.exports = db;
