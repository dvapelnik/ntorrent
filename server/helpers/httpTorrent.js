var fs = require('fs');
var request = require('request').defaults({jar: true});
var Url = require('url');

function getCurrentTimeStamp() {
  return +new Date();
}

module.exports = function getTorrentFromUrl(url, pathToSave, successCallback, errorCallback) {
  var urlParsed = Url.parse(url);

  if (!urlParsed.hostname || !urlParsed.host || !urlParsed.protocol || urlParsed.protocol === 'magnet:') {
    errorCallback({ownCode: 'URLWRONGERROR'});
  } else {
    var torrentHttpRequest = request
      .get({
        url: url,
        followRedirect: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36',
          'Referer': urlParsed.protocol + '://' + urlParsed.hostname + '/',
          'Host': urlParsed.hostname,
          'Connection': 'keep-alive'
        }
      })
      .on('error', function (error) {
        error.ownCode = 'REQERROR';
        errorCallback(error);
      })
      .on('response', function (response) {
        if (response.statusCode !== 200) {
          errorCallback({ownCode: 'HTTPERROR'});
        }
        //@todo check response code - report client about error on 400+
        if (response.headers['content-type'] == 'application/x-bittorrent') {
          var timeStamp = getCurrentTimeStamp();
          var torrentWriteStream = fs
            .createWriteStream(pathToSave + '/' + timeStamp + '_saved_via_link.torrent')
            .on('error', function (error) {
              error.ownCode = 'FSERROR';
              errorCallback(error)
            })
            .on('close', function () {
              successCallback(timeStamp);
            });

          torrentHttpRequest.pipe(torrentWriteStream);
        } else {
          errorCallback({ownCode: 'CONTENTTYPEERROR'});
        }
      });
  }


};