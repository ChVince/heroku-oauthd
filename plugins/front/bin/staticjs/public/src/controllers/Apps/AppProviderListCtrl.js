module.exports = function(app) {
  return app.controller('AppProviderListCtrl', [
    '$state', '$scope', '$rootScope', '$location', '$timeout', '$filter', 'UserService', '$stateParams', 'AppService', 'ProviderService', 'KeysetService', function($state, $scope, $rootScope, $location, $timeout, $filter, UserService, $stateParams, AppService, ProviderService, KeysetService) {
      $scope.loadingProviders = true;
      AppService.get($stateParams.key).then(function(app) {
        $scope.app = app;
        $scope.setApp(app);
        $scope.setProvider('Add a provider');
        return $scope.$apply();
      }).fail(function(e) {
        return console.error(e);
      });
      ProviderService.getAll().then(function(providers) {
        $scope.providers = providers;
        $scope.selectedProviders = providers;
        return $scope.$apply();
      }).fail(function(e) {
        return console.error(e);
      })["finally"](function() {
        $scope.loadingProviders = false;
        return $scope.$apply();
      });
      return $scope.queryChange = function() {
        return $timeout((function() {
          $scope.loadingProviders = true;
          $scope.selectedProviders = $scope.providers;
          if ($scope.query) {
            if ($scope.query.name && $scope.query.name !== "") {
              $scope.selectedProviders = $filter('filter')($scope.selectedProviders, {
                name: $scope.query.name
              });
            }
          }
          return $scope.loadingProviders = false;
        }), 500);
      };
    }
  ]);
};
