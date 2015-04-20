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
    logger.verbose('Responded: /torrent/text');

    var type = req.body.type;
    var text = req.body.text;

    if (type === undefined || !type || ['json', 'bencoded'].indexOf(type) == -1) {
      res.status(400).json({status: "ERROR", message: '[type] field is required', code: "FIELDREQIRED"});
    } else if (text === undefined || !text) {
      res.status(400).json({status: "ERROR", message: '[text] field is required', code: "FIELDREQIRED"});
    } else {
      async.waterfall([
        asyncWorkers.makeSessionDirWorker([config.uploadPath, req.session.id].join(path.sep)),
        function (uploadSessionPath, callback) {
          var toDecode;

          try {
            if (type === 'json') {
              toDecode = bencode.encode(JSON.parse(text)).toString();
            } else {
              toDecode = text;
            }

            callback(null, uploadSessionPath, toDecode);
          } catch (e) {
            callback({ownCode: "JSONFORMATERROR"});
          }
        },
        function (uploadSessionPath, toDecode, callback) {
          try {
            var decoded = bencode.decode(toDecode);
            callback(null, uploadSessionPath, decoded);
          } catch (e) {
            callback({ownCode: 'BENCODEDECODEERROR'});
          }
        },
        function (uploadSessionPath, decoded, callback) {
          try {
            var torrentBuffer = parseTorrent.encode(decoded);

            callback(null, uploadSessionPath, torrentBuffer);
          } catch (e) {
            console.log(e);
            console.log(e.stack);

            callback({ownCode: 'TORRENTENCODEERROR'});
          }
        },
        function (uploadSessionPath, torrentBuffer, callback) {
          var savePath = [
            config.uploadPath,
            req.session.id,
            +new Date() + '_from_' + type + '.torrent'
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
  }
};