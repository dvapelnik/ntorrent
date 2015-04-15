var torrentParser = require('../helpers/torrentParser');

module.exports = function (options) {
  var logger = options.logger;
  var config = options.config;

  return function (req, res) {
    logger.verbose('Responded: /upload/link');

    if (req.body.link) {
      var torrentLink = require('../helpers/torrentLink')({
        url: req.body.link,
        sessionId: req.session.id,
        uploadPath: config.uploadPath,
        response: res,
        logger: logger
      });

      var processSource = req.body.link.match(/^magnet/) != null
        ? torrentLink.getTorrentSourceFromMagnet        // source looks like a magnet link
        : torrentLink.getTorrentSourceFromRemoteFile;   // source looks like a file content

      processSource(
        function (source) {
          torrentParser(source, function (parsedData) {
            res.json({status: 'OK', message: 'Parsed', data: parsedData});
          })
        },
        function (error) {
          res.status(500).json({status: 'ERROR', message: 'Error occurred', code: error.ownCode});
        });
    } else {
      res.status(400).json({
        status: 'ERROR',
        message: 'Bad request: link not defined',
        code: 'LINKNOTDEFINEDERROR'
      });
    }
  };
};