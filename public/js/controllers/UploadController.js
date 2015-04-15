ngTorrentApp.controller('UploadController', function ($scope,
                                                      $rootScope,
                                                      growl,
                                                      $upload,
                                                      ngProgress,
                                                      $http,
                                                      ErrorVerbosity,
                                                      Torrent) {
  //$scope.uploadType = 'link';
  $scope.uploadType = 'file';

  $scope.uploadTypes = ['file', 'link'];
  $scope.setUploadType = function (uploadType) {
    $scope.uploadType = uploadType;
  };

  $scope.upload = function (files) {
    if (files.length == 1) {
      var file = files[0];
      ngProgress.start();
      $upload
        .upload({url: 'upload/file', file: file})
        .progress(function (event) {
          var progressPercentage = parseInt(100.0 * event.loaded / event.total);
          ngProgress.set(progressPercentage);
        })
        .success(function (data, status, headers, config) {
          ngProgress.complete();
          if (data.status == 'ERROR') {
            growl.error(ErrorVerbosity[data.code]);
          }
          $scope.addToTorrent(new Torrent(data.data));
          console.log(data);
        });
    }
  };

  $scope.uploadTorrent = function (link) {
    ngProgress.start();
    $http.post('upload/link', {link: link})
      .success(function (data) {
        ngProgress.complete();
        console.log(data);
      })
      .error(function (data) {
        ngProgress.complete();
        if (data.status == 'ERROR') {
          growl.error(ErrorVerbosity[data.code]);
        }
      });
    console.log('Uploading...');
  };
})