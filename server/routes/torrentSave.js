var _ = require('underscore');
var fs = require('fs');
var parseTorrent = require('../lib/torrentParser');
//var parseTorrent = require('parse-torrent-file');
var Buffer = require('buffer').Buffer;
var async = require('async');
var asyncWorkers = require('../helpers/asyncWorkers');

module.exports = function (options) {
  var config = options.config;
  var logger = options.logger;

  return function (req, res) {
    logger.verbose('Responded: /torrent/save');

    async.waterfall([
      function (callback) {
        if (req.body.torrentData.fileName) {
          callback(null, [config.uploadPath, req.session.id, req.body.torrentData.fileName].join('/'));
        } else {
          callback({ownCode: 'FILENAMEEMPTY'});
        }
      },
      asyncWorkers.readFileWorker,
      asyncWorkers.torrentParserWorker,
      function (parsed, callback) {
        var requestTorrent = req.body.torrentData.parsed;

        parsed.info.name = new Buffer(requestTorrent.name, 'utf8');

        parsed.announce = requestTorrent.announce;
        parsed.announceList = _.map(parsed.announce, function (announce) {
          return [announce];
        });

        parsed.comment = requestTorrent.comment;
        parsed.private = requestTorrent.private;
        parsed.creator = requestTorrent.creator;
        parsed.publisher = requestTorrent.publisher;
        parsed.publisherUrl = requestTorrent.publisherUrl;

        parsed.info.files = _.map(requestTorrent.files, function (file) {
          return {
            path: [new Buffer(file.path)],
            name: [],
            length: file.length,
            offset: file.offset
          };
        });

        parsed.created = new Date();

        callback(null, parsed);
      },
      function (parsed, callback) {
        var torrentBuffer = parseTorrent.encode(parsed);

        callback(null, torrentBuffer);
      },
      function (torrentBuffer, callback) {
        var savePath = [
          config.uploadPath,
          req.session.id,
          +new Date() + '_' + req.body.shortFileName + '.torrent'
        ].join('/');

        callback(null, savePath, torrentBuffer);
      },
      function (savePath, torrentBuffer, callback) {
        var writeStream = fs.createWriteStream(savePath);
        writeStream.on('error', function (error) {
          callback({ownCode: 'SAVEFILEERROR'});
        });
        writeStream.on('finish', callback);
        writeStream.write(torrentBuffer);
        writeStream.end();
      }
    ], function (error) {
      if (error) {
        res.json({status: 'ERROR', message: 'Save file error', code: error.ownCode});
      } else {
        res.json({status: 'OK', message: 'Saved'});
      }
    });
  }
};