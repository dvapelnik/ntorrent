var async = require('async');
var fs = require('fs');

var parseTorrent = require('parse-torrent');

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
      function (filePath, callback) {
        fs.readFile(filePath, function (error, fileContent) {
          if (error) {
            error.ownCode = 'READFILEERROR';
          }

          callback(error, fileContent);
        })
      },
      function (fileContent, callback) {
        callback(null, parseTorrent(fileContent));
      }
    ], function (error, parsed) {
      if (error) {
        res.status(400).json({status: 'ERROR', message: 'Parse error', code: error.ownCode});
      } else {
        res.json({
          status: 'OK', message: 'Parsed', data: {
            parsed: parsed,
            fileName: fileName
          }
        });
      }
    });
  }
};