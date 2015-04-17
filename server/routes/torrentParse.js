var async = require('async');
var fs = require('fs');
var asyncWorkers = require('../helpers/asyncWorkers');

module.exports = function (options) {
  var config = options.config;
  var logger = options.logger;

  return function (req, res) {
    var fileName = req.body.fileName;

    async.waterfall([
      function (callback) {
        callback(!fileName, fileName);
      },
      function (fileName, callback) {
        callback(null, [config.uploadPath, req.session.id, fileName].join('/'));
      },
      asyncWorkers.readFileWorker,
      asyncWorkers.torrentParserWorker,
      function (parsed, callback) {
        callback(null, {
          files: parsed.files,
          announce: parsed.announce,
          comment: parsed.comment,
          name: parsed.name,
          created: parsed.created
        })
      }
    ], function (error, data) {
      if (error) {
        res.status(400).json({status: 'ERROR', message: 'Parse error', code: error.ownCode});
      } else {
        res.json({
          status: 'OK', message: 'Parsed', data: {
            parsed: data,
            fileName: fileName
          }
        });
      }
    });
  }
};