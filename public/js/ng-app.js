(function (angular) {
  angular
    .module('ntorrent', [])
    .run(function ($rootScope) {
      $rootScope.appName = 'nTorrent';
      $rootScope.appTitle = 'nTorrent - make and edit .torrent file!';
    })
    .controller('MainController', function ($scope) {

    });
})(window.angular);