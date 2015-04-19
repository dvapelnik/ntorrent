var async = require('async');
var fs = require('fs');
var asyncWorkers = require('../helpers/asyncWorkers');

module.exports = function (options) {
  var config = options.config;
  var logger = options.logger;

  return function (req, res) {
    var fileName = req.body.fileName;

    async.waterfall([
      function (callback) {
        callback(!fileName, fileName);
      },
      function (fileName, callback) {
        callback(null, [config.uploadPath, req.session.id, fileName].join('/'));
      },
      asyncWorkers.readFileWorker,
      asyncWorkers.torrentParserWorker,
      function (parsed, callback) {
        callback(null, {
          full: parsed,
          files: parsed.files,
          encoding: parsed.encoding,
          pieceLength: parsed.pieceLength,
          private: parsed.private,
          pieceCount: parsed.pieces ? parsed.pieces.length : undefined,
          totalLength: parsed.length,
          announce: parsed.announce,
          comment: parsed.comment,
          creator: parsed.creator,
          name: parsed.name,
          created: parsed.created,
          infoHash: parsed.infoHash,
          publisher: parsed.publisher,
          publisherUrl: parsed.publisherUrl
        })
      }
    ], function (error, data) {
      if (error) {
        res.status(400).json({status: 'ERROR', message: 'Parse error', code: error.ownCode});
      } else {
        res.json({
          status: 'OK', message: 'Parsed', data: {
            parsed: data,
            fileName: fileName
          }
        });
      }
    });
  }
};