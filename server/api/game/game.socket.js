/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Game = require('../../sqldb').Game;

exports.register = function(socket) {
  Game.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  Game.hook('afterUpdate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  Game.hook('afterDestroy', function(doc, fields, fn) {
    onRemove(socket, doc);
    fn(null);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('game:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('game:remove', doc);
}
