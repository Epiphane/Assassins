/**
 * Main application routes
 */

'use strict';

var express = require('express');
var errors = require('./components/errors');
var docs = require('./components/docs');
var path = require('path');
var swagger = require("swagger-node-express");


module.exports = function(app) {
  swagger.setAppHandler(app);

  // Insert routes below
  app.use('/api/kills', require('./api/kill'));
  app.use('/api/games', require('./api/game'));
  app.use('/api/users', require('./api/user'));

  // Add Documentation below
  require('./api/kill/kill.swagger.js')(swagger, 'api');
  require('./api/game/game.swagger.js')(swagger, 'api');
  require('./api/user/user.swagger.js')(swagger, 'api');

  app.use('/auth', require('./auth'));

  // Documentation generator
  app.route('/api/docs').get(docs);
  app.use('/api/docs', express.static(__dirname + '/../node_modules/swagger-node-express/swagger-ui'));

  swagger.configureSwaggerPaths("", "/api/api-docs", "")
  swagger.configure("http://localhost:9000/", "0.1");

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
