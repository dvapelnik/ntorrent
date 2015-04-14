var async = require('async');
var fs = require('fs');
var httpTorrentDownloader = require('../helpers/httpTorrent');

var parseTorrent = require('parse-torrent');

module.exports = function (options) {
  var logger = options.logger;
  var config = options.config;

  return function (req, res) {
    logger.verbose('Responded: /upload/link');

    async.waterfall([
      function (callback) {
        logger.verbose('Link');
        logger.verbose(req.body.link);

        //@todo Check is req.body.link not empty

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
              var torrentData = parseTorrent(data);
              console.log(torrentData);
              callback(null, torrentData);
            }
          });
      }
    ], function (error, result) {
      if (error) {
        logger.error(error);
      }
      res.json(result);
    });
  }
};