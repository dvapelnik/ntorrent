var ngTorrentApp = angular
  .module('ntorrent', [
    'ngRoute', 'angular-growl', 'dvNgValidator',
    'angularFileUpload', 'ngProgress', 'underscore',
    'asyncWrapped', 'duScroll'
  ])
  .config(function ($routeProvider, growlProvider) {
    growlProvider.globalReversedOrder(true);
    growlProvider.globalTimeToLive(5000);

    $routeProvider
      .when('/upload', {
        templateUrl: 'ng-templates/upload.html',
        controller: 'UploadController'
      })
      .when('/edit', {
        templateUrl: 'ng-templates/edit.html',
        controller: 'EditController'
      })
      .otherwise({
        redirectTo: '/upload'
      });
  })
  .run(function ($rootScope, $anchorScroll) {
    $rootScope.appName = 'nTorrent';
    $rootScope.appSlogan = 'upload and edit .torrent file!';
  })
  .factory('ErrorVerbosity', function () {
    return {
      HTTPERROR: 'HTTP error occurred',
      URLWRONGERROR: 'Wrong url',
      FSERROR: 'File system error occured',
      FDOPENERROR: 'File descriptor error',
      SAVEFILEERROR: 'Cannot save file',
      READFILEERROR: 'Cannot read requested file',
      REQERROR: 'HTTP request error occurred',
      CONTENTTYPEERROR: 'Server responded with non bittorent content type',
      LINKNOTDEFINEDERROR: 'Link not defined',
      READDIRERROR: 'Readdir error',
      FILENAMEEMPTY: 'File name is empty',
      FILENOTFOUND: 'File not found',
      FILENOTDELETED: 'File not deleted',
      MIMEERROR: 'Unsupported file type',
      EMAILNOTSENT: 'Email not sent',
      TORRENTPARSEERROR: 'Torrent parse error. It looks like torrent file is corrupted',
      TORRENTENCODEERROR: 'Torrent encode error. It looks like torrent parsed data is corrupted',
      BENCODEDECODEERROR: 'Bencode decode error. String looks like incorrect or broken',
      JSONFORMATERROR: 'JSON decode error. JSON string looks like incorrect or broken',
      FIELDREQIRED: 'Request body is incomplete. Fill required fields'
    }
  })
  .factory('Torrent', function () {
    return function Torrent(torrentPath) {
      this.href = torrentPath;
      this.name = torrentPath.match(/[^\/]+$/)[0];
    }
  })
  .factory('generator', function () {
    return function (length, isAlphabeticalOnly) {
      length = length || 8;
      isAlphabeticalOnly = isAlphabeticalOnly !== undefined ? isAlphabeticalOnly : false;

      var alphaArray = 'qwertyuiopasdfghjklzxcvbnm'.split('');
      var numArray = '0987654321'.split('');

      var arr = isAlphabeticalOnly ? alphaArray : alphaArray.concat(numArray);

      var result = '';

      _.times(length, function () {
        result += _.sample(arr);
      });

      return result;
    }
  })
  .filter('bytes', function () {
    return function (bytes, precision) {
      if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
      if (typeof precision === 'undefined') precision = 1;
      var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
        number = Math.floor(Math.log(bytes) / Math.log(1024));
      return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    }
  });

var dvNgValidator = angular.module('dvNgValidator', [])
  .factory('validator', function () {
    return window.validator
  });

var underscore = angular.module('underscore', [])
  .factory('_', function () {
    return window._;
  });

var asyncWrapped = angular.module('asyncWrapped', [])
  .factory('async', function () {
    return window.async;
  });
