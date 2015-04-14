var fs = require('fs');
var async = require('async');
var generator = require('../helpers/generator');

module.exports = function (options) {
  var config = options.config;
  var logger = options.logger;

  return function (req, res) {
    logger.verbose('Responded: /upload/file');

    var file = req.files.file;

    async.waterfall([
      function (callback) {
        var uploadPath = config.uploadPath + '/' + req.session.id;

        fs.mkdir(uploadPath, 0775, function (error) {
          if (error && error.code !== 'EEXIST') {
            callback(error);
          } else {
            callback(null, uploadPath);
          }
        });
      },
      function makeUniqueFileName(uploadPath, callback) {
        var newFileName = generator(config.uniqueFilePrefixLength) + config.uniqueFileDelimiter + file.name;

        fs.exists(uploadPath + '/' + newFileName, function (exists) {
          if (exists) {
            makeUniqueFileName(uploadPath, callback);
          } else {
            callback(null, uploadPath, newFileName);
          }
        })
      },
      function (uploadPath, newFileName, callback) {
        fs.rename(file.path, uploadPath + '/' + newFileName, function (error) {
          callback(error);
        });
      },
      function (callback) {
        callback();
      }
    ], function (error, result) {
      if (error) {
        logger.error(error);
        console.log(error);
        res.send({status: 'ERROR', message: 'Some error occurred'});
      } else {
        res.send({status: 'OK', message: 'File saved'});
      }
    });
  }
};