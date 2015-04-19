var async = require('async');
var fs = require('fs');

module.exports = function (options) {
  var config = options.config;
  var logger = options.logger;

  return function (req, res) {
    logger.verbose('Responded: /torrent/remove');

    if (req.body.fileName) {
      async.waterfall([
        function (callback) {
          callback(
            req.body.fileName
              ? null
              : {ownCode: 'FILENAMEEMPTY'}, req.body.fileName);
        },
        function (fileName, callback) {
          var filePath = [config.uploadPath, req.session.id, fileName].join('/');
          fs.exists(filePath, function (exists) {
            callback(exists ? null : {ownCode: 'FILENOTFOUND'}, filePath);
          })
        },
        function (filePath, callback) {
          fs.unlink(filePath, function (error) {
            if (error) {
              error.ownCode = 'FILENOTDELETED';
            }
            callback(error);
          })
        }
      ], function (error) {
        if (error) {
          res.status(500).json({status: 'ERROR', message: 'File not deleted', code: error.ownCode});
        } else {
          res.json({status: 'OK', message: 'File deleted'});
        }
      });
    } else {
      res.status(400).json({status: "ERROR", message: 'Request body is incomplete', code: "FIELDREQIRED"});
    }
  }
};