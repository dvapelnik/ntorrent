var fs = require('fs');

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
  }
};