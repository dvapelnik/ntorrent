var async = require('async');
var torrentParser = require('../helpers/torrentParser');
var fs = require('fs');

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
        fs.readFile(savedFilePath, function (error, fileContent) {
          callback(error, fileContent);
        });
      },
      function (fileContent, callback) {
        torrentParser(fileContent, function (parsedData) {
          callback(null, parsedData);
        })
      }
    ], function (error, parsedData) {
      if (error) {
        res.status(500).json({status: 'ERROR', message: 'Save error occurred', code: error.ownCode});
      } else {
        res.json({status: 'OK', message: 'Parsed', data: parsedData});
      }
    });
  }
};