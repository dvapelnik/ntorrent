var parseTorrent = require('parse-torrent');
var async = require('async');
var fs = require('fs');

var asyncWorkers = require('../helpers/asyncWorkers');
var httpTorrentDownloader = require('./httpTorrent');

function getCurrentTimeStamp() {
  return +new Date();
}

module.exports = function (options) {
  if (
    options === undefined ||
    options.url === undefined ||
    options.sessionId === undefined ||
    options.uploadPath === undefined ||
    options.response === undefined ||
    options.logger === undefined
  ) {
    throw new Error('Options not fully implemented');
  }

  var url = options.url;
  var sessionId = options.sessionId;
  var uploadPath = options.uploadPath;
  var logger = options.logger;

  return {
    getTorrentPathFromRemoteFile: getTorrentPathFromRemoteFile
  };

  function getTorrentPathFromRemoteFile(successCallback, errorCallback) {
    async.waterfall([
      asyncWorkers.makeSessionDirWorker([uploadPath, sessionId].join('/')),
      function (uploadSessionPath, callback) {
        httpTorrentDownloader(
          url, uploadSessionPath,
          function (timeStamp) {
            callback(null, timeStamp)
          },
          function (error) {
            callback(error);
          });
      },
      function (timestamp, callback) {
        callback(null, [uploadPath, sessionId, timestamp + '.torrent'].join('/'));
      }
    ], function (error, filePath) {
      if (error) {
        errorCallback(error);
      } else {
        successCallback(filePath);
      }
    });
  }
};