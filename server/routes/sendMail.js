var nodemailer = require('nodemailer');
var path = require('path');

module.exports = function (options) {
  var config = options.config;
  var logger = options.logger;

  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.email.user,
      pass: config.email.pass
    }
  });

  return function (req, res) {
    logger.verbose('Responded: /send/mail');

    if (req.body.fileName && req.body.email) {
      var filePath = [config.uploadPath, req.session.id, req.body.fileName].join(path.sep);

      transporter.sendMail({
        sender: config.email.mailOptions.from,
        to: req.body.email,
        subject: 'nTorrent: ' + req.body.fileName,
        text: '',
        attachments: [{path: filePath}]
      }, function (error, info) {
        if (error) {
          res.status(500).json({status: 'ERROR', message: 'Email not sent', code: 'EMAILNOTSENT'});
        } else {
          res.json({status: 'OK', message: 'Email sent'});
        }
      });
    } else {
      res.status(400).json({status: "ERROR", message: 'Request body is incomplete', code: "FIELDREQIRED"});
    }
  }
};