var async = require('async');
var fs = require('fs');
var httpTorrentDownloader = require('../helpers/httpTorrent');

var parseTorrent = require('parse-torrent');

module.exports = function (options) {
  var logger = options.logger;
  var config = options.config;

  return function (req, res) {
    logger.verbose('Responded: /upload/link');

    if (req.body.link) {
      var resCallback = req.body.link.match(/^magnet/) != null
        ? getTorrentSourceFromMagnet
        : getTorrentSourceFromRemoteFile;

      resCallback(sourceCallbackImpl, errorCallbackImpl);
    } else {
      res.status(400).send('Bad request: link not defined');
    }

    function getTorrentSourceFromRemoteFile(sourceCallback, errorCallback) {
      async.waterfall([
        function (callback) {
          logger.verbose('Link');
          logger.verbose(req.body.link);

          httpTorrentDownloader(
            req.body.link, config.uploadPath + '/' + req.session.id,
            function (timeStamp) {
              callback(null, timeStamp)
            },
            function (error) {
              callback(error);
            });
        },
        function (timestamp, callback) {
          fs.readFile(
            [config.uploadPath, req.session.id, timestamp + '.torrent'].join('/'),
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
      sourceCallback(req.body.link);
    }

    function sourceCallbackImpl(source) {
      var torrentParsedData = parseTorrent(source);

      res.json(torrentParsedData);
    }

    function errorCallbackImpl(error) {
      res.status(500).send('Error occurred');
    }
  };
};