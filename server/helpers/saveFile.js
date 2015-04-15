var fs = require('fs');
var async = require('async');
var generator = require('../helpers/generator');
var mime = require('mime');

module.exports = function (options) {
  if (
    options === undefined ||
    options.uploadPath === undefined ||
    options.sessionId === undefined ||
    options.file === undefined ||
    options.uniqueFilePrefixLength === undefined ||
    options.uniqueFileDelimiter === undefined ||
    options.logger === undefined ||
    options.mimeList === undefined
  ) {
    throw new Error('Options not fully implemented');
  }

  var uploadPath = options.uploadPath;
  var file = options.file;
  var sessionId = options.sessionId;
  var uniqueFilePrefixLength = options.uniqueFilePrefixLength;
  var uniqueFileDelimiter = options.uniqueFileDelimiter;
  var logger = options.logger;
  var mimeList = options.mimeList;

  return saveFile;

  function saveFile(successCallback, errorCallback) {
    async.waterfall([
      function (callback) {
        callback(mimeList.indexOf(mime.lookup(file.name)) === -1
          ? {ownCode: 'MIMEERROR'}
          : null);
      },
      require('../helpers/asyncWorkers').makeSessionDirWorker([uploadPath, sessionId].join('/')),
      function makeUniqueFileName(uploadPath, callback) {
        var newFileName = [+new Date(), file.name].join(uniqueFileDelimiter);

        fs.exists([uploadPath, newFileName].join('/'), function (exists) {
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
        error.ownCode = error.ownCode || 'SAVEFILEERROR';
        errorCallback(error);
      } else {
        successCallback(filePath);
      }
    });
  }
};