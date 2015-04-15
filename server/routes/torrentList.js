var async = require('async');
var fs = require('fs');
var _ = require('underscore');

var asyncWorkers = require('../helpers/asyncWorkers');

module.exports = function (options) {
  var config = options.config;
  var logger = options.logger;

  return function (req, res) {
    logger.verbose('Responded: /torrent/list');

    async.waterfall([
      asyncWorkers.makeSessionDirWorker([config.uploadPath, req.session.id].join('/')),
      function (uploadSessionPath, callback) {
        fs.readdir(uploadSessionPath, function (error, files) {
          if (error) {
            error.ownCode = 'READIRERROR';
            callback(error);
          } else {
            callback(null, _.map(files, function (file) {
              return [uploadSessionPath, file].join('/');
            }))
          }
        })
      }
    ], function (error, torrentList) {
      if (error) {
        res.status(500).json({status: 'ERROR', message: 'Read session dir error', code: error.ownCode});
      } else {
        res.json({status: 'OK', message: 'Torrent file list', data: torrentList});
      }
    });
  }
};