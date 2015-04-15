ngTorrentApp.controller('MainController', function ($scope,
                                                    $http,
                                                    ngProgress,
                                                    growl,
                                                    Torrent,
                                                    ErrorVerbosity,
                                                    _) {
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

  $scope.torrents = [];

  $scope.removeFromTorrents = function (torrent) {
    ngProgress.start();
    $http
      .post('torrent/remove', {fileName: torrent.name})
      .success(function () {
        $scope.torrents.splice($scope.torrents.indexOf(torrent), 1);
        ngProgress.complete();
      })
      .error(function (data) {
        growl.error(ErrorVerbosity[data.code]);
        ngProgress.complete();
      });
  };

  $scope.addToTorrent = function (torrent) {
    $scope.torrents.push(torrent);
  };

  $scope.updateTorrentFileList = function () {
    ngProgress.start();
    $http
      .get('torrent/list')
      .success(function (data) {
        ngProgress.complete();
        _.each(data.data, function (torrent) {
          $scope.addToTorrent(new Torrent(torrent));
        })
      })
      .error(function () {
        growl.error('Http error on get torrent list occurred');
        ngProgress.complete();
      });
  };

  $scope.updateTorrentFileList();
});