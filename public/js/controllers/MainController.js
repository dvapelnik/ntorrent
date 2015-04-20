ngTorrentApp.controller('MainController', function ($rootScope,
                                                    $scope,
                                                    $http,
                                                    $location,
                                                    $document,
                                                    $timeout,
                                                    ngProgress,
                                                    growl,
                                                    Torrent,
                                                    ErrorVerbosity,
                                                    async,
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
  $scope.torrentToEdit = undefined;

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

  $scope.updateTorrentFileList = function (beforeCallback, successCallback, errorCallback, afterCallback) {
    beforeCallback = beforeCallback || function () {
    };
    successCallback = successCallback || function () {
    };
    errorCallback = errorCallback || function () {
    };
    afterCallback = afterCallback || function () {
    };

    beforeCallback();
    $http
      .get('torrent/list')
      .success(function (data) {
        $scope.torrents = [];
        _.each(data.data, function (torrent) {
          $scope.addToTorrent(new Torrent(torrent));
        })
        successCallback();
        afterCallback();
      })
      .error(function (data) {
        errorCallback({code: data.code});
        afterCallback();
      });
  };

  $scope.prepareToEdit = function (torrent) {
    ngProgress.start();
    $http
      .post('torrent/parse', {fileName: torrent.name})
      .success(function (data) {
        ngProgress.complete();
        $scope.torrentToEdit = data.data;
        $scope.torrentToEdit.shortFileName = data.data.fileName.match(/^[^_]+_(.+)\.torrent/)[1]
        $location.path('/edit');
      })
      .error(function (data) {
        growl.error(ErrorVerbosity[data.code]);
        ngProgress.complete();
      });
  };

  $scope.removeFrom = function (from, element) {
    if (from) {
      var indexOfElement = from.indexOf(element);
      from.splice(indexOfElement, 1);
    }
  };

  $scope.addAnnounce = function () {
    $scope.torrentToEdit.parsed.announce.push('');
  };

  $scope.addFile = function () {
    $scope.torrentToEdit.parsed.files.push({length: 0, name: '', offset: 0, path: ''});
  };

  $scope.saveTorrent = function () {
    async.waterfall([
      function (callback) {
        ngProgress.start();
        callback();
      },
      function (callback) {
        $http
          .post('torrent/save', {
            fileName: $scope.fileName,
            shortFileName: $scope.torrentToEdit.shortFileName,
            torrentData: $scope.torrentToEdit
          })
          .success(function () {
            callback();
          })
          .error(function (data) {
            callback({code: data.code});
          });
      },
      function (callback) {
        $scope.updateTorrentFileList(null, callback, callback, null);
      }
    ], function (error) {
      if (error) {
        growl.error(ErrorVerbosity[error.code]);
      } else {
        growl.success('New torrent file was generated');
        $location.path('/upload');
      }

      ngProgress.complete();
    });
  };

  $scope.toHome = function () {
    $scope.torrentToEdit = undefined;
    $location.path('/upload');
  };

  $scope.updateTorrentFileList(
    function () {
      ngProgress.start();
    },
    null,
    function (error) {
      growl.error('Http error on get torrent list occurred');
    },
    function () {
      ngProgress.complete();
    }
  );

  $scope.scrollTo = function (elementId) {
    var duration = 1000;
    var offset = 30;

    var tableTorrents = angular.element(document.getElementById(elementId));

    $timeout(function () {
      $document.scrollToElement(tableTorrents, offset, duration);
    }, 500);
  }
});