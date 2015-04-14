ngTorrentApp
  .controller('MainController', function ($scope) {
    $scope.safeApply = function (fn) {
      var phase = this.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        if (fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
  })
  .controller('UploadController', function ($scope, $rootScope, growl, validator) {
    //$scope.uploadType = 'link';
    $scope.uploadType = 'file';

    $scope.uploadTypes = ['file', 'link'];
    $scope.setUploadType = function (uploadType) {
      $scope.uploadType = uploadType;
    };

    $scope.torrentFile = '';
    $scope.torrentLink = '';

    $scope.fileSelected = function (input) {
      var torrentFileName = input.value.split(/(\\|\/)/).pop();

      if (torrentFileName.match(/\.torrent$/)) {
        $scope.safeApply(function () {
          $scope.torrentFile = torrentFileName;
        });
      } else {
        growl.error('Select a torrent file only', {title: 'Error!'});
      }
    };

    $scope.uploadTorrent = function () {
      console.log('Uploading...');
    };
  })
  .controller('EditController', function ($scope) {

  });