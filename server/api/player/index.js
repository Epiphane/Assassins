'use strict';

var express = require('express');
var controller = require('./player.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get   ('/', controller.index);
router.post  ('/', auth.isAuthenticated(), controller.create);
router.delete('/', auth.isAuthenticated(), controller.destroy);

module.exports = router;
