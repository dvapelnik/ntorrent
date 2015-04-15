var async = require('async');
var torrentParser = require('../helpers/torrentParser');
var fs = require('fs');

module.exports = function (options) {
  var config = options.config;
  var logger = options.logger;

  return function (req, res) {
    logger.verbose('Responded: /upload/file');

    var saveFile = require('../helpers/saveFile')({
      uploadPath: config.uploadPath,
      sessionId: req.session.id,
      file: req.files.file,
      uniqueFilePrefixLength: config.uniqueFilePrefixLength,
      uniqueFileDelimiter: config.uniqueFileDelimiter,
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
        res.json({status: 'OK', message: 'Parsed', data: savedFilePath});
      }
    });
  }
};