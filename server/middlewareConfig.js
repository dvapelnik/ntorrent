var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var generator = require('./helpers/generator');

module.exports = function (app) {
  app.use('/bower', express.static('public/bower'));
  app.use('/js', express.static('public/js'));
  app.use('/css', express.static('public/css'));
  app.use('/ng-templates', express.static('public/ng-templates'));
  app.use('/storage', express.static('storage'));

  app.use(cookieParser('very-secret-private-string-for-cookies', {}));
  app.use(bodyParser.json({limit: '50mb'}));       // to support JSON-encoded bodies
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
};