module.exports = function(app) {
  return app.controller('AppCreateCtrl', [
    '$state', '$scope', '$rootScope', '$location', 'UserService', '$stateParams', 'AppService', function($state, $scope, $rootScope, $location, UserService, $stateParams, AppService) {
      $scope.app = {};
      $scope.setTitle('Create an app');
      $scope.domains_control = {};
      return $scope.create = function() {
        return AppService.create($scope.app).then(function(app) {
          $state.go('dashboard.apps.show', {
            key: app.key
          });
        }).fail(function(e) {
          console.error(e);
        });
      };
    }
  ]);
};
