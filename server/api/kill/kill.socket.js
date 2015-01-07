/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Kill = require('../../sqldb').Kill;

exports.register = function(socket) {
  Kill.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  Kill.hook('afterUpdate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  Kill.hook('afterDestroy', function(doc, fields, fn) {
    onRemove(socket, doc);
    fn(null);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('kill:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('kill:remove', doc);
}
