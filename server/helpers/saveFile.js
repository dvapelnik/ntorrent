var fs = require('fs');
var async = require('async');
var generator = require('../helpers/generator');

module.exports = function (options) {
  if (
    options === undefined ||
    options.uploadPath === undefined ||
    options.sessionId === undefined ||
    options.file === undefined ||
    options.uniqueFilePrefixLength === undefined ||
    options.uniqueFileDelimiter === undefined ||
    options.logger === undefined
  ) {
    throw new Error('Options not fully implemented');
  }

  var uploadPath = options.uploadPath;
  var file = options.file;
  var sessionId = options.sessionId;
  var uniqueFilePrefixLength = options.uniqueFilePrefixLength;
  var uniqueFileDelimiter = options.uniqueFileDelimiter;
  var logger = options.logger;

  return saveFile;

  function saveFile(successCallback, errorCallback) {
    async.waterfall([
      require('../helpers/asyncWorkers').makeSessionDirWorker([uploadPath, sessionId].join('/')),
      function makeUniqueFileName(uploadPath, callback) {
        var newFileName = generator(uniqueFilePrefixLength) + uniqueFileDelimiter + file.name;

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
          callback(error, uploadPath + '/' + newFileName);
        });
      }
    ], function (error, filePath) {
      if (error) {
        error.ownCode = 'SAVEFILEERROR';
        errorCallback(error);
      } else {
        successCallback(filePath);
      }
    });
  }
};