var _ = require('underscore');

var express = require('express');
var fs = require('fs');

var config = require('./config');

module.exports = function (options) {
  var logger = options.logger;

  var app = new express();

  require('./middlewareConfig')(app);
  require('./routes')(app, {
    config: config,
    logger: logger
  });

  return app;
};