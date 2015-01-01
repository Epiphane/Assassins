/**
 * Error responses
 */

'use strict';

module.exports = function documentation(req, res) {
  var viewFilePath = 'api';

  res.render(viewFilePath, function(err) {
    if (err) {
      return res.json(result, result.status);
    }

    res.render(viewFilePath);
  });
};
