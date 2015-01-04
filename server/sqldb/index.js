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
db.Kill = db.sequelize.import(path.join(
  config.root,
  'server',
  'api',
  'kill',
  'kill.model'
));
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

// N:M Link between games and users
db.Game.belongsToMany(db.User, { through: db.Player });
db.User.belongsToMany(db.Game, { through: db.Player });

// A game belongs to an admin
db.Game.belongsTo(db.User, {
  constraints: false,
  foreignKey: {
    name: 'GameMasterId',
    allowNull: false
  }
});

// Kill model:
// Belongs to a game, and has a link to the killer and victim
db.Game.hasMany  (db.Kill);
db.Kill.belongsTo(db.Player, { as: 'killer' });
db.Kill.belongsTo(db.Player, { as: 'victim' });
db.Kill.belongsTo(db.Game);

module.exports = db;
