var ngTorrentApp = angular
  .module('ntorrent', ['ngRoute', 'angular-growl', 'dvNgValidator'])
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
  .run(function ($rootScope, $location) {
    $rootScope.appName = 'nTorrent';
    $rootScope.appSlogan = 'make and edit .torrent file!';

    $rootScope.torrentDataArray = [];

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
      if ($rootScope.torrentDataArray.length === 0) {
        // no logged user, we should be going to #login
        $location.path('/upload');
      }
    });
  });

var dvNgValidator = angular
  .module('dvNgValidator', [])
  .factory('validator', function () {
    return window.validator
  });
