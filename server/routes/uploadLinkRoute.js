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

      var resCallback = req.body.link.match(/^magnet/) != null
        ? torrentLink.getTorrentSourceFromMagnet
        : torrentLink.getTorrentSourceFromRemoteFile;

      resCallback(torrentLink.sourceCallbackImpl, torrentLink.errorCallbackImpl);
    } else {
      res.status(400).json({
        status: 'ERROR',
        message: 'Bad request: link not defined'
      });
    }
  };
};