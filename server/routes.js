var multipartyMiddlewareMaker = require('connect-multiparty');

var uploadFileRouteMaker = require('./routes/uploadFileRoute');
var uploadLinkRouteMaker = require('./routes/uploadLinkRoute');
var torrentListRouteMaker = require('./routes/torrentList');
var torrentRemoveRouteMaker = require('./routes/torrentRemove');
var torrentParseRouteMaker = require('./routes/torrentParse');
var torrentSaveRouteMaker = require('./routes/torrentSave');

var fs = require('fs');

module.exports = function (app, options) {
  var config = options.config;
  var logger = options.logger;

  var multipartyMiddleware = multipartyMiddlewareMaker({
    uploadDir: config.tmp
  });

  var routeMakerOptions = {
    config: config,
    logger: logger
  };

  app.get(/^\/(index.html)?$/, function (req, res) {
    logger.verbose('Responded: /');
    fs.createReadStream('public/index.html').pipe(res);
  });

  app.post('/upload/file', multipartyMiddleware, uploadFileRouteMaker(routeMakerOptions));

  app.post('/upload/link', uploadLinkRouteMaker(routeMakerOptions));

  app.get('/torrent/list', torrentListRouteMaker(routeMakerOptions));

  app.post('/torrent/remove', torrentRemoveRouteMaker(routeMakerOptions));

  app.post('/torrent/parse', torrentParseRouteMaker(routeMakerOptions));

  app.post('/torrent/save', torrentSaveRouteMaker(routeMakerOptions));
};