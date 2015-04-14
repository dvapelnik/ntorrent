var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      name: 'console-debug',
      level: 'debug',
      colorize: true
    }),
    new (winston.transports.Console)({
      name: 'console-warn',
      level: 'warn',
      colorize: true
    }),
    new (winston.transports.Console)({
      name: 'console-error',
      level: 'error',
      colorize: true
    })
  ]
});

var httpExpressServer = require('./httpExpressServer')({
  logger: logger
});

httpExpressServer.listen(8888, function () {
  logger.verbose('HTTP ExpressJS server started on 8888 port');
});