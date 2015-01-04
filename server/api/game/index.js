'use strict';

var express = require('express');
var controller = require('./game.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

// REST
router.get   ('/',        controller.index);
router.get   ('/:id',     controller.show);
router.post  ('/',        auth.isAuthenticated(), controller.create);
router.put   ('/:id',     auth.isAuthenticated(), controller.update);
router.delete('/:id',     auth.isAuthenticated(), controller.destroy);

// Round information (no model necessary)
router.get ('/:gid/round',  controller.validGame,    controller.round.show);
router.post('/:gid/round',  auth.isAuthenticated(),  controller.validGame,
  controller.isGameMaster,  controller.round.create);

// Separate models/controllers
router.use('/:gid/players', controller.validGame, require('../player'));
router.use('/:gid/kills',   controller.validGame, require('../kill'));

module.exports = router;
