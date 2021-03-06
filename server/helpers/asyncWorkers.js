var fs = require('fs');
var parseTorrent = require('parse-torrent-file');

module.exports = {
  makeSessionDirWorker: function (uploadSessionPath, chmod) {
    chmod = chmod || 0775;

    return function (callback) {
      fs.mkdir(uploadSessionPath, chmod, function (error) {
        if (error && error.code !== 'EEXIST') {
          error.ownCode = 'FSERROR';
          callback(error);
        } else {
          callback(null, uploadSessionPath);
        }
      });
    }
  },
  torrentParserWorker: function (fileContent, callback) {
    try {
      var parsed = parseTorrent(fileContent);
      callback(null, parsed);
    } catch (e) {
      console.log(e);
      console.log(e.stack);
      callback({ownCode: 'TORRENTPARSEERROR'});
    }
  },
  readFileWorker: function (filePath, callback) {
    fs.readFile(filePath, function (error, fileContent) {
      if (error) {
        error.ownCode = 'READFILEERROR';
      }

      callback(error, fileContent);
    })
  }
};