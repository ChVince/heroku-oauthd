module.exports = function(app) {
  return app.controller('AppTryModalCtrl', [
    '$scope', '$rootScope', '$modalInstance', 'success', 'err', 'provider', 'key', 'type', 'backend', function($scope, $rootScope, $modalInstance, success, err, provider, key, type, backend) {
      $scope.success = success;
      $scope.err = err;
      $scope.provider = provider;
      $scope.key = key;
      $scope.type = type;
      $scope.backend = backend;
      return $scope.close = function() {
        return $modalInstance.dismiss();
      };
    }
  ]);
};
