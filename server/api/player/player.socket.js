/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Player = require('../../sqldb').Player;

exports.register = function(socket) {
  Player.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  Player.hook('afterUpdate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  Player.hook('afterDestroy', function(doc, fields, fn) {
    onRemove(socket, doc);
    fn(null);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('player:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('player:remove', doc);
}
