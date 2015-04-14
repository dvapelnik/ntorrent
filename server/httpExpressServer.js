var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var fs = require('fs');
var generator = require('./helpers/generator');

winston = require('winston');

module.exports = function (options) {
  var logger = options.logger;

  var app = new express();

  //region Config and Middleware
  app.use('/bower', express.static('public/bower'));
  app.use('/js', express.static('public/js'));

  app.use(cookieParser('very-secret-private-string-for-cookies', {}));

  app.set('trust proxy', 1);
  app.use(session({
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      expires: false
    },
    genid: function (req) {
      return genuuid();
    },
    secret: 'very-secret-private-string-for-session'
  }));
  app.use(function (req, res, next) {
    var sess = req.session;

    if (sess.id === undefined) {
      sess.id = generator(32);
    }

    console.info(sess.id);

    next();
  });
  //endregion

  app.get(/^\/(index.html)?$/, function (req, res) {
    logger.verbose('Responded: /');
    fs.createReadStream('public/index.html').pipe(res);
  });

  return app;
};