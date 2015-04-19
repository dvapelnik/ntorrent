var bencode = require('bencode');
var async = require('async');
var asyncWorkers = require('../helpers/asyncWorkers');
var path = require('path');
var fs = require('fs');
var parseTorrent = require('parse-torrent-file');

module.exports = function (options) {
  var config = options.config;
  var logger = options.logger;

  return function (req, res) {
    console.log(req.body.bencodedText);

    async.waterfall([
      asyncWorkers.makeSessionDirWorker([config.uploadPath, req.session.id].join(path.sep)),
      function (uploadSessionPath, callback) {
        try {
          var decoded = bencode.decode(req.body.bencodedText);
          callback(null, uploadSessionPath, decoded);
        } catch (e) {
          callback({ownCode: 'BENCODEDECODEERROR'});
        }
      },
      function (uploadSessionPath, decoded, callback) {
        console.log(decoded);

        var torrentBuffer = parseTorrent.encode(decoded);

        console.log(torrentBuffer);

        callback(null, uploadSessionPath, torrentBuffer);
      },
      function (uploadSessionPath, torrentBuffer, callback) {
        var savePath = [
          config.uploadPath,
          req.session.id,
          +new Date() + '_from_bencoded.torrent'
        ].join('/');

        callback(null, savePath, torrentBuffer);
      }, function (savePath, torrentBuffer, callback) {
        var writeStream = fs.createWriteStream(savePath);
        writeStream.on('error', function (error) {
          callback({ownCode: 'SAVEFILEERROR'});
        });
        writeStream.on('finish', function () {
          callback(null, savePath);
        });
        writeStream.write(torrentBuffer);
        writeStream.end();
      }
    ], function (error, savePath) {
      if (error) {
        res.status(400).json({status: 'ERROR', message: 'Parse error occurred', code: error.ownCode});
      } else {
        res.json({status: 'OK', message: 'Saved', data: savePath});
      }
    });
  }
};