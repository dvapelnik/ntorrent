var async = require('async');
var fs = require('fs');

module.exports = function (options) {
  var config = options.config;
  var logger = options.logger;

  return function (req, res) {
    logger.verbose('Responded: /upload/file');

    if (req.files.file) {
      var saveFile = require('../helpers/saveFile')({
        uploadPath: config.uploadPath,
        sessionId: req.session.id,
        file: req.files.file,
        uniqueFilePrefixLength: config.uniqueFilePrefixLength,
        uniqueFileDelimiter: config.uniqueFileDelimiter,
        mimeList: ['application/x-bittorrent'],
        logger: logger
      });

      async.waterfall([
        function (callback) {
          saveFile(
            function (savedFilePath) {
              callback(null, savedFilePath);
            }, function (error) {
              callback(error);
            }
          );
        }
      ], function (error, savedFilePath) {
        if (error) {
          res.status(500).json({status: 'ERROR', message: 'Save error occurred', code: error.ownCode});
        } else {
          res.json({status: 'OK', message: 'Saved', data: savedFilePath});
        }
      });
    } else {
      res.status(400).json({status: "ERROR", message: 'Request body is incomplete', code: "FIELDREQIRED"});
    }
  }
};