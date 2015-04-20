var fs = require('fs');
var request = require('request').defaults({jar: true});
var Url = require('url');
var contentDisposition = require('content-disposition')

function getCurrentTimeStamp() {
  return +new Date();
}

module.exports = function getTorrentFromUrl(url, pathToSave, successCallback, errorCallback) {
  var urlParsed = Url.parse(url);

  if (!urlParsed.hostname || !urlParsed.host || !urlParsed.protocol) {
    errorCallback({ownCode: 'URLWRONGERROR'});
  } else {
    var torrentHttpRequest = request
      .get({
        url: url,
        followRedirect: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36',
          'Referer': urlParsed.protocol + '//' + urlParsed.hostname + '/',
          'Accept-language': 'en',
          'Host': urlParsed.hostname,
          'Connection': 'keep-alive',
          'Accept-Encoding': 'gzip, deflate, sdch',
          'Accept': 'text/html,application/xhtml+xml,application/xml,application/x-bittorrent;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'ru,en-US;q=0.8,en;q=0.6,uk;q=0.4'
        }
      })
      .on('error', function (error) {
        error.ownCode = 'REQERROR';
        errorCallback(error);
      })
      .on('response', function (response) {
        if (response.statusCode >= 400) {
          errorCallback({ownCode: 'HTTPERROR'});
        }

        if (['application/x-bittorrent', 'application/octet-stream', 'application/force-download']
            .indexOf(response.headers['content-type']) > -1) {

          var timeStamp = getCurrentTimeStamp();
          var matches;
          var fileNameFromUrl;

          if (matches = urlParsed.path.match(/[^\/]+.torrent$/)) {
            fileNameFromUrl = matches[0];
          } else {
            try {
              var responseContentDispositions = contentDisposition.parse(response.headers['content-disposition']);

              if (responseContentDispositions.type == 'attachment' &&
                responseContentDispositions.parameters &&
                responseContentDispositions.parameters.filename) {
                fileNameFromUrl = responseContentDispositions.parameters.filename;
              } else {
                throw new Error('Content Disposition in incorrect');
              }
            } catch (e) {
              fileNameFromUrl = 'saved_via_link.torrent';
            }
          }

          var fileName = [timeStamp, fileNameFromUrl].join('_');

          var torrentWriteStream = fs
            .createWriteStream(pathToSave + '/' + fileName)
            .on('error', function (error) {
              error.ownCode = 'FSERROR';
              errorCallback(error)
            })
            .on('close', function () {
              successCallback(fileName);
            });

          torrentHttpRequest.pipe(torrentWriteStream);
        }
        else {
          errorCallback({ownCode: 'CONTENTTYPEERROR'});
        }
      });
  }


};