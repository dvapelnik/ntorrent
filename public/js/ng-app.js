var ngTorrentApp = angular
  .module('ntorrent', ['ngRoute', 'angular-growl', 'dvNgValidator', 'angularFileUpload', 'ngProgress'])
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
  .run(function ($rootScope, $location, ngProgress) {
    $rootScope.appName = 'nTorrent';
    $rootScope.appSlogan = 'make and edit .torrent file!';

    $rootScope.torrentDataArray = [];

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
      if ($rootScope.torrentDataArray.length === 0) {
        $location.path('/upload');
      }
    });
  })
  .factory('ErrorVerbosity', function () {
    return {
      HTTPERROR: 'HTTP error occurred',
      FSERROR: 'File system error occured',
      SAVEFILEERROR: 'Cannot save file',
      REQERROR: 'HTTP request error occurred',
      CONTENTTYPEERROR: 'Server responded with non bittorent content type',
      LINKNOTDEFINEDERROR: 'Link not defined'
    }
  });

var dvNgValidator = angular
  .module('dvNgValidator', [])
  .factory('validator', function () {
    return window.validator
  });
