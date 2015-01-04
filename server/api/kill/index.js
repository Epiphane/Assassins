'use strict';

var express = require('express');
var controller = require('./kill.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get ('/',     controller.index);
router.get ('/:id',  controller.show);
router.post('/:pid', auth.isAuthenticated(), controller.create);

module.exports = router;
