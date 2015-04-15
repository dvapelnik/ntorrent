var parseTorrent = require('parse-torrent');
var async = require('async');
var fs = require('fs');

var httpTorrentDownloader = require('./httpTorrent');

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
  var response = options.response;
  var logger = options.logger;

  return {
    getTorrentSourceFromRemoteFile: getTorrentSourceFromRemoteFile,
    getTorrentSourceFromMagnet: getTorrentSourceFromMagnet,
    sourceCallbackImpl: sourceCallbackImpl,
    errorCallbackImpl: errorCallbackImpl
  };

  function getTorrentSourceFromRemoteFile(sourceCallback, errorCallback) {
    async.waterfall([
      function (callback) {
        logger.verbose('Link');
        logger.verbose(url);

        httpTorrentDownloader(
          url, [uploadPath, sessionId].join('/'),
          function (timeStamp) {
            callback(null, timeStamp)
          },
          function (error) {
            callback(error);
          });
      },
      function (timestamp, callback) {
        fs.readFile(
          [uploadPath, sessionId, timestamp + '.torrent'].join('/'),
          function (error, data) {
            if (error) {
              callback(error);
            } else {
              callback(null, data);

            }
          });
      }
    ], function (error, source) {
      if (error) {
        errorCallback(error);
      } else {
        sourceCallback(source);
      }
    });
  }

  function getTorrentSourceFromMagnet(sourceCallback) {
    sourceCallback(url);
  }

  function sourceCallbackImpl(source) {
    var torrentParsedData = parseTorrent(source);

    response.json(torrentParsedData);
  }

  function errorCallbackImpl(error) {
    response.status(500).send('Error occurred');
  }
};