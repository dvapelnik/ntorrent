var async = require('async');

module.exports = function (options) {
  var config = options.config;
  var logger = options.logger;

  return function (req, res) {
    logger.verbose('Responded: /upload/file');

    var saveFile = require('../helpers/saveFile')({
      uploadPathRoot: config.uploadPath,
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
      },
      function (savedFilePath, callback) {
        callback();
      }
    ], function (error, result) {
      if (error) {
        res.status(500).send('Save error occurred');
      } else {
        res.json({status: 'OK', message: 'File saved'});
      }
    });
  }
};