ngTorrentApp.controller('EditController', function ($scope, $location, ngProgress) {
  if ($scope.torrentToEdit === undefined) {
    $location.path('/upload');
  }

  console.info($scope.torrentToEdit);

  $scope.scrollTo('edit-top-form');
});